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
        <span class="text-sm text-gray-500 dark:text-gray-400" i18n="@@PENDING">
          Pending...
        </span>
      } @else if (translation()?.status === 'estimating') {
        <span class="text-sm text-gray-500 dark:text-gray-400" i18n="@@ESTIMATING">
          Estimating...
        </span>
      } @else if (translation()?.status === 'translating') {
        <span class="text-sm text-gray-500 dark:text-gray-400" i18n="@@TRANSLATING_PROGRESS">
          Translation: {{ translation()?.transUnitDone }}/{{ translation()?.transUnitFound }}
        </span>
      } @else if (translation()?.status === 'completed') {
        <span class="text-sm text-green-500 dark:text-green-400" i18n="@@TRANSLATION_COMPLETED">
          Translation: {{ translation()?.transUnitDone }}/{{ translation()?.transUnitFound }}
        </span>
      } @else if (translation()?.status === 'cancelling') {
        <span class="text-sm text-gray-500 dark:text-gray-400" i18n="@@CANCELING">
          Cancelling...
        </span>
      } @else if (translation()?.status === 'cancelled') {
        <span class="text-sm text-red-500 dark:text-red-400" i18n="@@CANCELLED">
          Cancelled
        </span>
      } @else {
        <span class="text-sm text-red-500 dark:text-red-400">
          {{ translation()?.status }}
        </span>
      }
    } @else {
      <span class="text-sm text-red-500 dark:text-red-400">
        No translation available...
      </span>
    }
    @if(translation()?.status === 'estimating' || translation()?.status === 'translating') {
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

  onCloseModal($event: {branch: string, ext: string, transUnitState: string, procedeedTransUnitState: string} | null ) {
    this.isModalOpen.set(false);
    if (!$event) {
      return;
    }
    this.subscription?.unsubscribe();
    this.subscription = this.repositoryService.translateRepository(this.repository(), $event).pipe(
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