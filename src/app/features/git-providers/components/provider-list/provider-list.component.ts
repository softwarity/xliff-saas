import { Component, inject } from '@angular/core';
import { GitProviderService } from '../../../../core/services/git-provider.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProviderCardComponent } from '../provider-card/provider-card.component';

@Component({
  selector: 'app-provider-list',
  standalone: true,
  imports: [ProviderCardComponent],
  templateUrl: './provider-list.component.html'
})
export class ProviderListComponent {
  private gitProviderService = inject(GitProviderService);
  protected providers = toSignal(this.gitProviderService.providers$, { initialValue: [] });
}