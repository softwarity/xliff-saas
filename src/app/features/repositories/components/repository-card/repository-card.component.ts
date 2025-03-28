import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProviderLogoComponent } from '../../../../shared/components/provider-logo/provider-logo.component';
import { Repository } from '../../../../shared/models/repository.model';
import { EstimateComponent } from '../estimate/estimate.component';
import { TranslateComponent } from '../translate/translate-modal/translate.component';

@Component({
  selector: 'app-repository-card',
  standalone: true,
  imports: [
    CommonModule, 
    ProviderLogoComponent, 
    EstimateComponent,
    TranslateComponent
  ],
  templateUrl: './repository-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepositoryCardComponent {
  repository = input.required<Repository>();
}