import { CommonModule } from '@angular/common';
import { Component, effect, forwardRef, inject, input } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Observable, of, tap } from 'rxjs';
import { Repository } from '../../../../shared/models/repository.model';
import { TypedControlValueAccessor } from '../../../../shared/typed-value-control-accessor';
import { RepositoryService } from '../../../../core/services/repository.service';

@Component({
  selector: 'app-branch-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './branch-selector.component.html',
  styles: [
    `
      :host {
        display: block;
        position: relative;
        @apply w-full;
      }
      select {
        @apply w-full border rounded-lg px-4 py-2 appearance-none cursor-pointer;
        @apply bg-white border border-gray-300;
        @apply disabled:opacity-50 disabled:cursor-not-allowed;
        @apply focus:outline-none focus:ring-2 focus:ring-primary;
        @apply dark:bg-dark-800 dark:border-gray-600 dark:text-white;
      }
      svg {
        @apply absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 pointer-events-none;
      }
      `
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BranchSelectorComponent), multi: true }
  ]
})
export class BranchSelectorComponent implements TypedControlValueAccessor<string | null> {

  repository = input.required<Repository>();
  private repositoryService = inject(RepositoryService);
  
  branches$: Observable<string[]> = of([]);
  branchFC: FormControl<string | null> = new FormControl<string | null>(null);

  constructor() {
    effect(() => {
      this.branchFC.disable();
      this.branches$ = this.repositoryService.getBranches(this.repository()).pipe(
        tap(() => this.branchFC.enable()),
        tap((branches) => {
          if (branches.length > 0 && (!this.branchFC.value || !branches.includes(this.branchFC.value))) {
            this.branchFC.setValue(branches[0]);
          }
        })  
      );
    })
  }

  writeValue(value: string): void {
    this.branchFC.setValue(value);
  } 

  registerOnChange(fn: (value: string | null) => void): void {
    this.branchFC.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: (value: string | null) => void): void {
    this.branchFC.valueChanges.subscribe(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.branchFC.disable();
    } else {
      this.branchFC.enable();
    }
  }
}