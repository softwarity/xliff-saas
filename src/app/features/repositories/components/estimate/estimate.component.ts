import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, OnDestroy, signal } from '@angular/core';
import { Observer, Subscription, switchMap, tap } from 'rxjs';
import { JobService } from '../../../../core/services/job.service';
import { Job } from '../../../../shared/models/job.model';
import { Repository } from '../../../../shared/models/repository.model';
import { RepositoryService } from '../../services/repository.service';
import { EstimateModalComponent } from './estimate-modal/estimate-modal.component';

@Component({
  selector: 'app-estimate',
  standalone: true,
  imports: [
    CommonModule, 
    EstimateModalComponent,
  ],
  template: `
    <div class="flex items-center justify-between gap-2">
    @if (estimation()) {
      @if (estimation()?.status === 'pending') {
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Pending...
        </span>
      } @else if (estimation()?.status === 'estimation_running') {
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Estimating...
        </span>
      } @else if (estimation()?.status === 'completed') {
        <span class="text-sm text-green-500 dark:text-green-400">
          {{ estimation()?.transUnitFound }} translation units detected
        </span>
      }
    } @else {
      <span class="text-sm text-red-500 dark:text-red-400">
        No estimation available...
      </span>
    }
    @if(estimation()?.status === 'estimation_running') {
      <button (click)="isModalOpen.set(true)" class="flat-warning" i18n="@@CANCEL">
        Cancel
      </button>
    } @else {
      <button (click)="isModalOpen.set(true)" class="flat-primary" [disabled]="estimation() && estimation()?.status !== 'completed'" i18n="@@ESTIMATE">
        Estimate
      </button>
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
}