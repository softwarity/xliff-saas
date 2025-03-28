import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProviderListComponent } from './components/provider-list/provider-list.component';
import '../../web-components/icon';
@Component({
  selector: 'app-git-providers',
  standalone: true,
  imports: [ProviderListComponent],
  template: `
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 dark:text-white">
      <span class="flex items-center">
        <app-icon name="git" fill="#f03b2e93" stroke="#f03b2e93" size="24" class="h-5 w-5 md:h-6 md:w-6 md:mr-2"/>
        <span i18n="@@GIT_PROVIDERS_TITLE">Git Providers</span>
      </span>
    </h1>
    <app-provider-list></app-provider-list>
  </div>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GitProvidersComponent {}