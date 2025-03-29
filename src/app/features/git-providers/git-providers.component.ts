import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GitProviderService } from '../../core/services/git-provider.service';
import '../../web-components/icon';
import { ProviderCardComponent } from './components/provider-card/provider-card.component';
@Component({
  selector: 'app-git-providers',
  standalone: true,
  imports: [ProviderCardComponent],
  template: `
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 dark:text-white">
      <span class="flex items-center">
      <svg class="h-5 w-5 md:h-6 md:w-6 md:mr-2" xmlns="http://www.w3.org/2000/svg" width="92pt" height="92pt" viewBox="0 0 92 92">
        <path style="stroke:none;fill-rule:nonzero;fill:#f03b2e93;fill-opacity:1" d="M90.156 41.965 50.036 1.848a5.918 5.918 0 0 0-8.372 0l-8.328 8.332 10.566 10.566a7.03 7.03 0 0 1 7.23 1.684 7.034 7.034 0 0 1 1.669 7.277l10.187 10.184a7.028 7.028 0 0 1 7.278 1.672 7.04 7.04 0 0 1 0 9.957 7.05 7.05 0 0 1-9.965 0 7.044 7.044 0 0 1-1.528-7.66l-9.5-9.497V59.36a7.04 7.04 0 0 1 1.86 11.29 7.04 7.04 0 0 1-9.957 0 7.04 7.04 0 0 1 0-9.958 7.06 7.06 0 0 1 2.304-1.539V33.926a7.049 7.049 0 0 1-3.82-9.234L29.242 14.272 1.73 41.777a5.925 5.925 0 0 0 0 8.371L41.852 90.27a5.925 5.925 0 0 0 8.37 0l39.934-39.934a5.925 5.925 0 0 0 0-8.371"/>
      </svg>
      <span i18n="@@GIT_PROVIDERS_TITLE">Git Providers</span>
      </span>
    </h1>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      @for (provider of providers(); track provider.type) {
        <app-provider-card [provider]="provider"></app-provider-card>
      }
    </div>
  </div>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GitProvidersComponent {
  private gitProviderService = inject(GitProviderService);
  protected providers = toSignal(this.gitProviderService.providers$, { initialValue: [] });
}