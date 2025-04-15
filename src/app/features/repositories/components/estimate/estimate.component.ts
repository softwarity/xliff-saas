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
    @if (estimation()) {
      @if (estimation()?.status === 'pending') {
        <span class="text-sm text-gray-500 dark:text-gray-400" i18n="@@PENDING">Pending...</span>
      } @else if (estimation()?.status === 'estimating') {
        <span class="text-sm text-gray-500 dark:text-gray-400" i18n="@@ESTIMATING">Estimating...</span>
      } @else if (estimation()?.status === 'translating') {
        <span class="text-sm text-gray-500 dark:text-gray-400" i18n="@@TRANSLATING">Translating...</span>
      } @else if (estimation()?.status === 'cancelling') {
        <span class="text-sm text-gray-500 dark:text-gray-400" i18n="@@CANCELING">Cancelling...</span>
      } @else if (estimation()?.status === 'cancelled') {
        <span class="text-sm text-red-500 dark:text-red-400" i18n="@@CANCELLED">Cancelled</span>
      } @else if (estimation()?.status === 'completed') {
        <span class="text-sm text-green-500 dark:text-green-400" i18n="@@TRANSLATION_UNITS_DETECTED">{{ estimation()?.transUnitFound }} translation units detected</span>
      } @else {
        <span class="text-sm text-red-500 dark:text-red-400">{{ estimation()?.status }}</span>
      }
    } @else {
      <span class="text-sm text-red-500 dark:text-red-400" i18n="@@NO_ESTIMATION_AVAILABLE">No estimation available...</span>
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

  onCloseModal($event: {branch: string, ext: string, transUnitState: string} | null ) {
    this.isModalOpen.set(false);
    if (!$event) {
      return;
    }
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

  // onCancel() {
  //   const id = this.estimation()?.id;
  //   if (!!id) {
  //     this.jobService.cancelJob(id).subscribe();
  //   }
  // }

  onCancel(): Observable<void> {
    const id = this.estimation()?.id;
    console.log('on confirm Cancel');
    if (!!id) { 
      this.estimation.update((job: Job | null | undefined) => job ? ({ ...job, status: 'cancelling' }) : null);
      return this.jobService.cancelJob(id);
    }
    return of(void 0);
  }
}