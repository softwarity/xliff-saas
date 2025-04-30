import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, OnDestroy, signal } from '@angular/core';
import { Observable, Observer, of, Subscription, switchMap, tap } from 'rxjs';
import { JobService } from '../../../../core/services/job.service';
import { CancelConfirmComponent } from '../../../../shared/components/cancel-confirm.component';
import { PurchaseCreditsButtonComponent } from '../../../../shared/components/purchase-credits-button.component';
import { Job } from '../../../../shared/models/job.model';
import { Repository } from '../../../../shared/models/repository.model';
import { RepositoryService } from '../../../../core/services/repository.service';
import { TranslateModalComponent } from './translate-modal/translate-modal.component';

@Component({
  selector: 'app-translate',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModalComponent,
    CancelConfirmComponent,
    PurchaseCreditsButtonComponent
  ],
  template: `
<div class="flex items-center justify-between gap-2">
    @if (translation(); as translation) {
      @switch (translation.status) {
        @case ('pending') {
          <span class="text-sm text-gray-500 dark:text-gray-400" i18n="@@PENDING">Pending...</span>
        }
        @case ('estimating') {
          <span class="text-sm text-gray-500 dark:text-gray-400" i18n="@@ESTIMATING">Estimating...</span>
        }
        @case ('translating') {
          <span class="text-sm text-gray-500 dark:text-gray-400" i18n="@@TRANSLATING_PROGRESS">Translation: {{ translation.transUnitDone }}/{{ translation.transUnitFound }}</span>
        }
        @case ('completed') {
          <span class="text-sm text-green-500 dark:text-green-400" i18n="@@TRANSLATION_COMPLETED">Translation: {{ translation.transUnitDone }}/{{ translation.transUnitFound }}</span>
        }
        @case ('cancelling') {
          <span class="text-sm text-gray-500 dark:text-gray-400" i18n="@@CANCELING">Cancelling...</span>
        }
        @case ('cancelled') {
          <span class="text-sm text-red-300 dark:text-red-200" i18n="@@CANCELLED">Cancelled</span>
        }
        @case ('failed') {
          <span class="text-sm text-red-500 dark:text-red-400" i18n="@@FAILED">Failed</span>
        }
      }
    } @else {
      <span class="text-sm text-red-300 dark:text-red-200" i18n="@@NO_TRANSLATION_AVAILABLE">No translation available...</span>
    }
    @if (balance() <= 0) {
      <app-purchase-credits-button buttonClass="flat-secondary"></app-purchase-credits-button>
    } @else {
      @if(translation()?.status === 'pending' || translation()?.status === 'estimating' || translation()?.status === 'translating') {
        <app-cancel-confirm [confirmCallback]="onCancel.bind(this)" />
      } @else {
        <button (click)="isModalOpen.set(true)" class="button flat-primary" i18n="@@TRANSLATE" [disabled]="disabled() || translation()?.status === 'cancelling'">Translate</button>
      }
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
  balance = input.required<number>();
  isModalOpen = signal(false);
  repositoryService = inject(RepositoryService);
  translation = signal<Job | null | undefined>(null);
  private jobService = inject(JobService);
  private subscription?: Subscription;
  disabled = signal(false);

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
    this.disabled.set(true);
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
      this.disabled.set(false);
      if(!job) {
        this.translation.set(null);
      } else {
        this.translation.set(job);
      }
    },
    error: (error) => {
      this.disabled.set(false);
      this.translation.set(null);
      console.error('Error subscribing to job changes:', error);
    }
  };

  onCancel(): Observable<void> {
    const id = this.translation()?.id;
    console.log('on confirm Cancel');
    if (!!id) { 
      this.translation.update((job: Job | null | undefined) => job ? ({ ...job, status: 'cancelling' }) : null);
      return this.jobService.cancelJob(id);
    }
    return of(void 0);
  }
}