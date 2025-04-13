import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupportService } from './support.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 i18n="@@SUPPORT_TITLE" class="text-2xl font-bold text-gray-900 dark:text-white">
          Support Tickets
        </h1>
        <div class="flex items-center gap-4">
          <button (click)="refreshIssues()" class="button stroke-primary" [disabled]="isLoading()" i18n="@@REFRESH_TICKETS">
            <svg [class.animate-spin]="isLoading()" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
          </button>
          <a routerLink="/support/create" class="button flat-primary" i18n="@@CREATE_NEW_TICKET">
            Create New Ticket
          </a>
        </div>
      </div>

      <!-- Filtres -->
      <div class="bg-white dark:bg-dark-800 rounded-lg shadow-md p-4 mb-6">
        <form [formGroup]="filterForm" class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
              <input type="text" formControlName="search" class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-dark-900 text-gray-900 dark:text-white" i18n-placeholder="@@SEARCH_TICKETS_PLACEHOLDER" placeholder="Search tickets by title or description..."/>
            </div>
          </div>
          
          <div class="flex gap-4">
            <!-- Filtres d'état -->
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-2">
                <input type="checkbox" id="open" formControlName="open" class="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"/>
                <label for="open" class="text-sm text-gray-700 dark:text-gray-300" i18n="@@FILTER_OPEN_STATE">
                  Open
                </label>
              </div>
              <div class="flex items-center gap-2 ml-4">
                <input type="checkbox" id="closed" formControlName="closed" class="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"/>
                <label for="closed" class="text-sm text-gray-700 dark:text-gray-300" i18n="@@FILTER_CLOSED_STATE">
                  Closed
                </label>
              </div>
            </div>
            
            <!-- Filtre de type -->
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-2">
                <button type="button" 
                  class="badge cursor-pointer"
                  [class.warning]="filterTypes.bug()"
                  (click)="toggleFilterType('bug')" 
                  i18n="@@FILTER_TYPE_BUG">Bug</button>
                <button type="button" 
                  class="badge cursor-pointer"
                  [class.primary]="filterTypes.feature()"
                  (click)="toggleFilterType('feature')"
                  i18n="@@FILTER_TYPE_FEATURE">Feature</button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="bg-white dark:bg-dark-800 rounded-lg shadow-md">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                  <span i18n="@@TICKET_STATE">State</span>
                </th>
                <th i18n="@@TICKET_TITLE" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th i18n="@@TICKET_TYPE" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                  Type
                </th>
                <th i18n="@@TICKET_COMMENTS" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                  Comments
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">
                  <span class="sr-only" i18n="@@TICKET_ACTIONS">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-gray-700">
              @for (issue of filteredIssues(); track issue.id) {
                <tr class="hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      @if (issue.state === 'open') {
                        <svg class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        <span class="sr-only" i18n="@@TICKET_STATE_OPEN">Open</span>
                      } @else {
                        <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        <span class="sr-only" i18n="@@TICKET_STATE_CLOSED">Closed</span>
                      }
                      <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">#{{ issue.number }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <a [routerLink]="['/support', issue.number]" class="hover:underline font-medium">
                      {{ issue.title }}
                    </a>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    @if (issue.type === 'Bug') {
                      <span class="badge warning" i18n="@@TICKET_TYPE_BUG_LABEL">Bug</span>
                    } @else if (issue.type === 'Feature') {
                      <span class="badge primary" i18n="@@TICKET_TYPE_FEATURE_LABEL">Feature</span>
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div class="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      {{ issue.comments }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <a [routerLink]="['/support', issue.number]" class="text-primary hover:text-primary-hover inline-flex items-center" i18n="@@VIEW_TICKET">
                      View
                    </a>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400" i18n="@@NO_TICKETS_FOUND">
                    No tickets found
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (totalPages() > 1) {
          <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div class="flex-1 flex justify-between sm:hidden">
              <button (click)="previousPage()" [disabled]="currentPage() === 1" class="button stroke-primary" i18n="@@PREVIOUS_PAGE">
                Previous
              </button> 
              <button (click)="nextPage()" [disabled]="currentPage() === totalPages()" class="button stroke-primary" i18n="@@NEXT_PAGE">
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-300" i18n="@@PAGE_INFO">Page {{ currentPage() }} of {{ totalPages() }}</p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button (click)="previousPage()" [disabled]="currentPage() === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700">
                    <span class="sr-only" i18n="@@PREVIOUS_PAGE_SR">Previous</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  @for (page of pages(); track page) {
                    @if (page === currentPage()) {    
                      <button class="z-10 bg-primary border-primary text-white relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        {{ page }}
                      </button>
                    } @else {
                      <button (click)="goToPage(page)" class="bg-white dark:bg-dark-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        {{ page }}
                      </button>
                    }
                  }
                  <button (click)="nextPage()" [disabled]="currentPage() === totalPages()" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700">
                    <span class="sr-only" i18n="@@NEXT_PAGE_SR">Next</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  providers: [SupportService],
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 500;
      line-height: 1;
      border-radius: 9999px;
      text-transform: uppercase;
    }
  `]
})
export class SupportComponent implements OnInit {
  private readonly supportService = inject(SupportService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly pageSize = 10;
  
  protected readonly issues = signal<Issue[]>([]);
  protected readonly filteredIssues = signal<Issue[]>([]);
  protected readonly currentPage = signal(1);
  protected readonly totalIssues = signal(0);
  protected readonly totalPages = signal(0);
  protected readonly pages = signal<number[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly filterForm: FormGroup;
  
  // États des filtres de type
  protected readonly filterTypes = {
    bug: signal(true),
    feature: signal(true)
  };

  constructor() {
    // Initialiser le formulaire de filtrage
    this.filterForm = this.fb.group({
      search: [''],
      open: [true],
      closed: [true]
    });

    // Écouter les changements des filtres
    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      takeUntilDestroyed()
    ).subscribe(() => {
      this.applyFilters();
    });

    // Écouter les changements de paramètres pour recharger les tickets
    this.route.queryParams.pipe(
      takeUntilDestroyed()
    ).subscribe(() => {
      this.loadIssues();
    });
  }

  ngOnInit(): void {
    // Le chargement initial est géré par l'abonnement au constructeur
  }

  private loadIssues(): void {
    this.isLoading.set(true);
    this.supportService.getIssues(this.currentPage(), this.pageSize).subscribe({
      next: (response) => {
        this.issues.set(response.data);
        this.totalIssues.set(response.count);
        this.totalPages.set(Math.ceil(response.count / this.pageSize));
        this.pages.set(Array.from({ length: this.totalPages() }, (_, i) => i + 1));
        this.isLoading.set(false);
        this.applyFilters(); // Appliquer les filtres après le chargement
      },
      error: (error) => {
        console.error('Failed to load issues:', error);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Applique les filtres sur la liste des tickets
   */
  private applyFilters(): void {
    const filters = this.filterForm.value;
    const searchText = filters.search.toLowerCase();
    
    // Déterminer les états à afficher
    const states: string[] = [];
    if (filters.open) states.push('open');
    if (filters.closed) states.push('closed');

    const filtered = this.issues().filter(issue => {
      // Filtre par état
      if (states.length > 0 && !states.includes(issue.state)) {
        return false;
      }

      // Filtre par type
      const activeTypes: string[] = [];
      if (this.filterTypes.bug()) activeTypes.push('Bug');
      if (this.filterTypes.feature()) activeTypes.push('Feature');
      
      if (activeTypes.length > 0 && issue.type && !activeTypes.includes(issue.type)) {
        return false;
      }

      // Filtre par texte dans le titre ou le corps
      if (searchText) {
        return (
          issue.title.toLowerCase().includes(searchText) ||
          issue.body.toLowerCase().includes(searchText)
        );
      }

      return true;
    });

    this.filteredIssues.set(filtered);
  }

  protected refreshIssues(): void {
    this.loadIssues();
  }

  protected nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadIssues();
    }
  }

  protected previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadIssues();
    }
  }

  protected goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadIssues();
  }

  protected toggleFilterType(type: 'bug' | 'feature'): void {
    // Vérifier si l'action va désactiver les deux filtres
    const otherType = type === 'bug' ? 'feature' : 'bug';
    const currentTypeActive = this.filterTypes[type]();
    const otherTypeActive = this.filterTypes[otherType]();
    
    // Si nous allons désactiver les deux filtres à la fois
    if (currentTypeActive && !otherTypeActive) {
      // Activer les deux au lieu de désactiver les deux
      this.filterTypes.bug.set(true);
      this.filterTypes.feature.set(true);
    } else {
      // Comportement normal: basculer l'état du filtre cliqué
      this.filterTypes[type].set(!currentTypeActive);
    }
    
    this.applyFilters();
  }
}
