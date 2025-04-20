import { CommonModule } from '@angular/common';
import { Component, effect, forwardRef, inject, input } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, of, tap } from 'rxjs';
import { Repository } from '../../../../shared/models/repository.model';
import { TypedControlValueAccessor } from '../../../../shared/typed-value-control-accessor';
import { BitbucketService } from './bitbucket.service';
import { GithubService } from './github.service';
import { GitlabService } from './gitlab.service';

@Component({
  selector: 'app-branch-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="relative w-full block">
    <select [formControl]="branchFC" placeholder="Select a branch" 
    class="w-full border rounded-lg px-4 py-2 appearance-none cursor-pointer bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-800 dark:border-gray-600 dark:text-white">
      @for (branch of branches$ | async; track branch) {
        <option [value]="branch">{{ branch }}</option>
      }
      @empty() {
        <option value="" disabled i18n="@@NO_BRANCHES_AVAILABLE">No branches available</option>
      }
    </select>
    <svg fill="currentColor"  stroke="currentColor"  viewBox="0 0 24 24"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 pointer-events-none">
      <path d="M12 16L6 10H18L12 16Z"/>
    </svg>
  </div>
  `,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BranchSelectorComponent), multi: true },
    BitbucketService,
    GithubService,
    GitlabService
  ]
})
export class BranchSelectorComponent implements TypedControlValueAccessor<string | null> {

  repository = input.required<Repository>();
  private bitbucketService = inject(BitbucketService);
  private githubService = inject(GithubService);
  private gitlabService = inject(GitlabService);
  
  branches$: Observable<string[]> = of([]);
  branchFC: FormControl<string | null> = new FormControl<string | null>(null);

  constructor() {
    effect(() => {
      this.branchFC.disable();
      let branches$;
      if (this.repository().provider === 'bitbucket') {
        branches$ = this.bitbucketService.getBranches(this.repository());
      } else if (this.repository().provider === 'github') {
        branches$ = this.githubService.getBranches(this.repository());
      } else  {
        branches$ = this.gitlabService.getBranches(this.repository());
      }
      this.branches$ = branches$.pipe(
        map((branches: string[]) => branches.sort((a, b) => a.length - b.length)),
        tap(() => this.branchFC.enable()),
        tap((branches) => {
          if (branches.length > 0 && (!this.branchFC.value || !branches.includes(this.branchFC.value))) {
            if (branches.includes('main')) {
              this.branchFC.setValue('main');
            } else if (branches.includes('master')) {
              this.branchFC.setValue('master');
            } else {
              this.branchFC.setValue(branches[0]);
            }
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