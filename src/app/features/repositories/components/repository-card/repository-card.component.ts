import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { Repository } from '../../../../shared/models/repository.model';
import '../../../../web-components/icon';
import { EstimateComponent } from '../estimate/estimate.component';
import { TranslateComponent } from '../translate/translate.component';

@Component({
  selector: 'app-repository-card',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [
    CommonModule, 
    EstimateComponent,
    TranslateComponent
  ],
  templateUrl: './repository-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepositoryCardComponent {
  repository = input.required<Repository>();
  balance = input.required<number>();
}