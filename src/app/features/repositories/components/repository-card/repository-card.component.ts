import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, OnDestroy, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProviderLogoComponent } from '../../../../shared/components/provider-logo/provider-logo.component';
import { Job } from '../../../../shared/models/job.model';
import { Repository } from '../../../../shared/models/repository.model';
import { JobService } from '../../services/job.service';
import { RepositoryService } from '../../services/repository.service';
import { RepositoryEstimateModalComponent } from '../repository-estimate-modal/repository-estimate-modal.component';
import { RepositoryTranslateModalComponent } from '../repository-translate-modal/repository-translate-modal.component';

@Component({
  selector: 'app-repository-card',
  standalone: true,
  imports: [
    CommonModule, 
    ProviderLogoComponent, 
    ReactiveFormsModule,
    RepositoryEstimateModalComponent,
    RepositoryTranslateModalComponent

  ],
  templateUrl: './repository-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepositoryCardComponent implements OnDestroy {
  branchFC: FormControl<string | null> = new FormControl<string | null>(null);
  repository = input.required<Repository>();
  isEstimateModalOpen = signal(false);
  isTranslateModalOpen = signal(false);
  repositoryService = inject(RepositoryService);
  estimation = signal<Job | null | undefined>(null);
  translation = signal<Job | null | undefined>(null);
  private jobService = inject(JobService);
  private subscriptions: Subscription = new Subscription();

  constructor() {
    
    effect(() => {
      const { provider, namespace, name: repository, defaultBranch } = this.repository();
      this.branchFC.setValue(defaultBranch || null);
      this.subscriptions.add(this.jobService.subscribeToJobChanges({ provider, namespace, repository }).subscribe({
        next: ({request, value: job}: {request: string, value: Job | null}) => {
          if(!job) {
            request === 'estimation' ? this.estimation.set(null) : this.translation.set(null);
          } else {
            request === 'estimation' ? this.estimation.set(job) : this.translation.set(job);
          }
        },
        error: (error) => {
          this.estimation.set(null);
          this.translation.set(null);
          console.error('Error subscribing to job changes:', error);
        }
      }));
    });
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onCloseEstimateModal($event: {branch: string, ext: string, transUnitState: string} | null ) {
    this.isEstimateModalOpen.set(false);
    if (!$event) {
      return;
    }
    this.repositoryService.estimateRepository(this.repository(), $event).subscribe({
      next: (message) => {
        console.log('Estimate message:', message);
      },
      error: (error) => {
        console.error('Error estimating repository:', error);
      }
    });
  }
  onCloseTranslateModal($event: {branch: string, ext: string, transUnitState: string, procedeedTransUnitState: string} | null ) {
    this.isTranslateModalOpen.set(false);
    if (!$event) {
      return;
    }
    this.repositoryService.translateRepository(this.repository(), $event).subscribe({
      next: (message) => {
        console.log('Translate message:', message);
      },
      error: (error) => {
        console.error('Error estimating repository:', error);
      }
    });
  }
}