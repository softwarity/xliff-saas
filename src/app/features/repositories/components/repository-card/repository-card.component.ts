import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, OnDestroy, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProviderLogoComponent } from '../../../../shared/components/provider-logo/provider-logo.component';
import { Estimation } from '../../../../shared/models/estimation.model';
import { Repository } from '../../../../shared/models/repository.model';
import { EstimationService } from '../../services/estimation.service';
import { RepositoryService } from '../../services/repository.service';
import { RepositoryEstimateModalComponent } from '../repository-estimate-modal/repository-estimate-modal.component';

@Component({
  selector: 'app-repository-card',
  standalone: true,
  imports: [
    CommonModule, 
    ProviderLogoComponent, 
    ReactiveFormsModule,
    RepositoryEstimateModalComponent
  ],
  templateUrl: './repository-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepositoryCardComponent implements OnDestroy {
  branchFC: FormControl<string | null> = new FormControl<string | null>(null);
  repository = input.required<Repository>();
  isEstimateModalOpen = signal(false);
  repositoryService = inject(RepositoryService);
  estimation = signal<Estimation | null | undefined>(null);
  private estimationService = inject(EstimationService);
  private subscriptions: Subscription = new Subscription();

  constructor() {
    effect(() => {
      const { namespace, name: repository, defaultBranch } = this.repository();
      this.branchFC.setValue(defaultBranch || null);
      this.subscriptions.add(this.estimationService.subscribeToEstimationChanges({ namespace, repository }).subscribe({
        next: (estimation: Estimation | null) => {
          console.log('Estimation in effect:', estimation, namespace, repository);
          this.estimation.set(estimation);
        },
        error: (error) => {
          this.estimation.set(null);
          console.error('Error subscribing to estimation changes:', error);
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
}