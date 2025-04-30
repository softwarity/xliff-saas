import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, OnDestroy, signal } from '@angular/core';
import { Observable, Observer, of, Subscription, switchMap, tap } from 'rxjs';
import { JobService } from '../../../../core/services/job.service';
import { Job } from '../../../../shared/models/job.model';
import { Repository } from '../../../../shared/models/repository.model';
import { RepositoryService } from '../../../../core/services/repository.service';
import { EstimateModalComponent } from './estimate-modal/estimate-modal.component';
import { CancelConfirmComponent } from '../../../../shared/components/cancel-confirm.component';

@Component({
  selector: 'app-estimate',
  standalone: true,
  imports: [
    CommonModule, 
    EstimateModalComponent,
    CancelConfirmComponent
  ],
  template: `
    <div class="flex items-center justify-between gap-2">
    @switch(estimation()?.status) {
      @case('pending') {
        <span class="text-sm text-gray-500 dark:text-gray-400" i18n="@@PENDING">Pending...</span>
      }
      @case('estimating') {
        <span class="text-sm text-gray-500 dark:text-gray-400" i18n="@@ESTIMATING">Estimating...</span>
      }
      @case('translating') {
        <span class="text-sm text-gray-500 dark:text-gray-400" i18n="@@TRANSLATING">Translating...</span>
      }
      @case('cancelling') {
        <span class="text-sm text-gray-500 dark:text-gray-400" i18n="@@CANCELING">Cancelling...</span>
      }
      @case('cancelled') {
        <span class="text-sm text-red-300 dark:text-red-200" i18n="@@CANCELLED">Cancelled</span>
      }
      @case('failed') {
        <span class="text-sm text-red-500 dark:text-red-400" i18n="@@FAILED">Failed</span>
      }
      @case('completed') {
        <div class="flex items-center gap-2">
          <span class="text-sm text-green-500 dark:text-green-400" i18n="@@TRANSLATION_UNITS_DETECTED">{{ estimation()?.transUnitFound }} translation units detected</span>
          <div class="relative group">
            <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 cursor-help" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
              <path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z"/>
            </svg>
            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {{ getEstimatedTime() }}
            </div>
          </div>
        </div>
      }
      @default {
        <span class="text-sm text-red-300 dark:text-red-200" i18n="@@NO_ESTIMATION_AVAILABLE">No estimation available...</span>
      }
    }
    @if(estimation()?.status === 'pending' || estimation()?.status === 'estimating') {
      <app-cancel-confirm [confirmCallback]="onCancel.bind(this)" />
    } @else {
      <button (click)="isModalOpen.set(true)" class="flat-primary" i18n="@@ESTIMATE">Estimate</button>
    }
  </div>
  @if (isModalOpen()) {
  <app-estimate-modal [repository]="repository()" (closeModal)="onCloseModal($event)" />
  }
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimateComponent implements OnDestroy {
  repository = input.required<Repository>();
  isModalOpen = signal(false);
  repositoryService = inject(RepositoryService);
  estimation = signal<Job | null | undefined>(null);
  private jobService = inject(JobService);
  private subscription?: Subscription;

  constructor() {
    effect(() => {
      const { provider, namespace, name: repository } = this.repository();
      this.subscription = this.jobService.subscribeToJobChanges({ provider, namespace, repository, request: 'estimation' }).subscribe(this.observerJobChanges);
    });
  }
  
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getEstimatedTime(): string {
    const transUnits = this.estimation()?.transUnitFound || 0;
    const minTime = transUnits * 12; // 12 secondes par unité
    const maxTime = transUnits * 15; // 15 secondes par unité
    
    const averageTime = Math.round((minTime + maxTime) / 2);
    const minutes = Math.round(averageTime / 60);
    
    return $localize`:@@ESTIMATED_TIME:Estimated time: ${minutes} minutes`;
  }

  onCloseModal($event: {branch: string, ext: string, transUnitState: string} | null ) {
    this.isModalOpen.set(false);
    if (!$event) {
      return;
    }
    this.estimation.set({status: 'pending'} as Job);
    this.subscription?.unsubscribe();
    this.subscription = this.repositoryService.estimateRepository(this.repository(), $event).pipe(
      tap((job) => {
        this.estimation.set(job);
      }),
      switchMap((job) => this.jobService.subscribeToJobChanges({ jobId: job.id }))
    ).subscribe(this.observerJobChanges);
  }

  observerJobChanges: Partial<Observer<Job | null>> = {
    next: (job: Job | null) => {
      if(!job) {
        this.estimation.set(null);
      } else {
        this.estimation.set(job);
      }
    },
    error: (error) => {
      this.estimation.set(null);
      console.error('Error subscribing to job changes:', error);
    }
  };

  onCancel(): Observable<void> {
    const id = this.estimation()?.id;
    if (!!id) { 
      this.estimation.update((job: Job | null | undefined) => job ? ({ ...job, status: 'cancelling' }) : null);
      return this.jobService.cancelJob(id);
    }
    return of(void 0);
  }
}