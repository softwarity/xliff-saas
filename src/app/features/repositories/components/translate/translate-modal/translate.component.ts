import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, OnDestroy, signal } from '@angular/core';
import { Observer, Subscription, switchMap, tap } from 'rxjs';
import { JobService } from '../../../../../core/services/job.service';
import { Job } from '../../../../../shared/models/job.model';
import { Repository } from '../../../../../shared/models/repository.model';
import { RepositoryService } from '../../../services/repository.service';
import { TranslateModalComponent } from './translate-modal.component';

@Component({
  selector: 'app-translate',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModalComponent,
  ],
  template: `
<div class="flex items-center justify-between gap-2">
    @if (translation()) {
      @if (translation()?.status === 'pending') {
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Pending...
        </span>
      } @else if (translation()?.status === 'estimation_running') {
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Estimating...
        </span>
      } @else if (translation()?.status === 'translation_running') {
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Translation: {{ translation()?.transUnitDone }}/{{ translation()?.transUnitFound }}
        </span>
      } @else if (translation()?.status === 'completed') {
        <span class="text-sm text-green-500 dark:text-green-400">
          Translation: {{ translation()?.transUnitDone }}/{{ translation()?.transUnitFound }}
        </span>
      } @else {
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ translation()?.status }}
        </span>
      }
    } @else {
      <span class="text-sm text-red-500 dark:text-red-400">
        No translation available...
      </span>
    }
    @if(translation()?.status === 'estimation_running' || translation()?.status === 'translation_running') {
      <button (click)="isModalOpen.set(true)" class="flat-warning" i18n="@@CANCEL">
        Cancel
      </button>
    } @else {
      <button (click)="isModalOpen.set(true)" class="flat-primary" [disabled]="translation() && translation()?.status !== 'completed'" i18n="@@TRANSLATE">
        Translate
      </button>
    }
  </div>
  @if (isModalOpen()) {
  <app-translate-modal [repository]="repository()" (closeModal)="onCloseModal($event)" />
  }
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TranslateComponent implements OnDestroy {
  repository = input.required<Repository>();
  isModalOpen = signal(false);
  repositoryService = inject(RepositoryService);
  translation = signal<Job | null | undefined>(null);
  private jobService = inject(JobService);
  private subscription?: Subscription;

  constructor() {
    effect(() => {
      const { provider, namespace, name: repository } = this.repository();
      this.subscription = this.jobService.subscribeToJobChanges({ provider, namespace, repository, request: 'translation' }).subscribe(this.observerJobChanges);
    });
  }
  
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onCloseModal($event: {branch: string, ext: string, transUnitState: string} | null ) {
    this.isModalOpen.set(false);
    if (!$event) {
      return;
    }
    this.subscription?.unsubscribe();
    this.subscription = this.repositoryService.estimateRepository(this.repository(), $event).pipe(
      tap((job) => {
        this.translation.set(job);
      }),
      switchMap((job) => this.jobService.subscribeToJobChanges({ jobId: job.id }))
    ).subscribe(this.observerJobChanges);
  }

  observerJobChanges: Partial<Observer<Job | null>> = {
    next: (job: Job | null) => {
      if(!job) {
        this.translation.set(null);
      } else {
        this.translation.set(job);
      }
    },
    error: (error) => {
      this.translation.set(null);
      console.error('Error subscribing to job changes:', error);
    }
  };
}