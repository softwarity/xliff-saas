import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { SupportService } from './support.service';
@Component({
  templateUrl: './support.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  providers: [SupportService]
})
export class SupportComponent {
  private readonly supportService = inject(SupportService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly pageSize = 10;
  
  protected readonly issues = signal<Issue[]>([]);
  protected readonly currentPage = signal(1);
  protected readonly totalPages = signal(0);
  protected readonly hasNextPage = signal(false);
  protected readonly hasPreviousPage = signal(false);
  protected readonly isLoading = signal(false);
  protected readonly filterForm: FormGroup;
  
  
  protected readonly pages = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });
  
  // États des filtres de type
  protected readonly filterTypes = {
    bug: signal(true),
    feature: signal(true)
  };

  constructor() {
    // Initialize the filter form
    this.filterForm = this.fb.group({
      search: [''],
      open: [true],
      closed: [true]
    });

    // Listen for filter changes
    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      takeUntilDestroyed()
    ).subscribe(() => {
      // Reset to page 1 when filter changes
      this.currentPage.set(1);
      this.loadIssues();
    });

    // Listen for query parameter changes to reload tickets
    this.route.queryParams.pipe(
      takeUntilDestroyed()
    ).subscribe(() => {
      this.loadIssues();
    });
  }

  private loadIssues(): void {
    this.isLoading.set(true);
    
    // Prepare filters for the API
    const filters: {search?: string, state?: string, type?: string} = {};
    if (this.filterForm.valid) {
      const searchValue = this.filterForm.get('search')?.value;
      if (searchValue) {
        filters.search = searchValue;
      }
      
      const open = this.filterForm.get('open')?.value;
      const closed = this.filterForm.get('closed')?.value;
      const stateValue = open && !closed ? 'open' : closed && !open ? 'closed' : undefined;
      if (stateValue) {
        filters.state = stateValue;
      }
      const bug = this.filterTypes.bug();
      const feature = this.filterTypes.feature();
      const typeValue = bug && !feature ? 'Bug' : feature && !bug ? 'Feature' : undefined;
      if (typeValue) {
        filters.type = typeValue;
      }
    }
    
    this.supportService.getIssues(this.currentPage(), this.pageSize, filters).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: ({data, pagination}: {data: Issue[], pagination: {totalCount: number, totalPages: number, currentPage: number, hasNextPage: boolean, hasPreviousPage: boolean}}) => {
        this.issues.set(data);
        this.hasNextPage.set(pagination.hasNextPage);
        this.hasPreviousPage.set(pagination.hasPreviousPage);
        this.currentPage.set(pagination.currentPage);
        this.totalPages.set(pagination.totalPages);
      }
    });
  }

  protected refreshIssues(): void {
    this.loadIssues();
  }

  protected nextPage(): void {
    if (this.hasNextPage()) {
      this.currentPage.update(page => page + 1);
      this.loadIssues();
    }
  }

  protected previousPage(): void {
    if (this.hasPreviousPage()) {
      this.currentPage.update(page => page - 1);
      this.loadIssues();
    }
  }

  protected goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadIssues();
  }

  protected toggleFilterType(type: 'bug' | 'feature'): void {
    // Check if the action will disable both filters
    const otherType = type === 'bug' ? 'feature' : 'bug';
    const currentTypeActive = this.filterTypes[type]();
    const otherTypeActive = this.filterTypes[otherType]();
    
    // If we are going to disable both filters at once
    if (currentTypeActive && !otherTypeActive) {
      // Enable both instead of disabling both
      this.filterTypes.bug.set(true);
      this.filterTypes.feature.set(true);
    } else {
      // Normal behavior: toggle the state of the clicked filter
      this.filterTypes[type].set(!currentTypeActive);
    }
    
    // Reset to page 1 and load issues with new filters
    this.currentPage.set(1);
    this.loadIssues();
  }
}
