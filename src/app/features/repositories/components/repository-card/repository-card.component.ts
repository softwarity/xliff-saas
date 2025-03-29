import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, effect, input } from '@angular/core';
import { Repository } from '../../../../shared/models/repository.model';
import { EstimateComponent } from '../estimate/estimate.component';
import { TranslateComponent } from '../translate/translate.component';
import '../../../../web-components/icon';

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

  constructor() {
    effect(() => {
      console.log('RepositoryCardComponent Balance:', this.balance());
    });
  }
}