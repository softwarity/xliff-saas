// faq.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-features',
  standalone: true,
  template: `
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12 dark:text-white" i18n="@@FEATURES_TITLE">Key Features</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="p-6 rounded-lg bg-white dark:bg-dark-700 shadow-lg border border-light-border dark:border-dark-600 hover:transform hover:scale-105">
          <h3 class="text-xl font-semibold mb-4 text-primary dark:text-blue-400" i18n="@@GIT_INTEGRATION_TITLE">Git Integration</h3>
          <div class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="ml-2" i18n="@@GIT_INTEGRATION_DESCRIPTION">Connect with GitHub, GitLab, and Bitbucket repositories seamlessly</span>
          </div>
        </div>
        <div class="p-6 rounded-lg bg-white dark:bg-dark-700 shadow-lg border border-light-border dark:border-dark-600 hover:transform hover:scale-105">
          <h3 class="text-xl font-semibold mb-4 text-primary dark:text-blue-400" i18n="@@CONTEXT_AWARE_AI_TITLE">Context-Aware AI</h3>
          <div class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="ml-2" i18n="@@CONTEXT_AWARE_AI_DESCRIPTION">Intelligent translations based on your application's context and business domain</span>
          </div>
        </div>
        <div class="p-6 rounded-lg bg-white dark:bg-dark-700 shadow-lg border border-light-border dark:border-dark-600 hover:transform hover:scale-105">
          <h3 class="text-xl font-semibold mb-4 text-primary dark:text-blue-400" i18n="@@AUTOMATED_WORKFLOW_TITLE">Automated Workflow</h3>
          <div class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="ml-2" i18n="@@AUTOMATED_WORKFLOW_DESCRIPTION">Automatic branch creation and pull requests for your translations</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hover\\:transform {
      transition: transform 0.3s ease-in-out;
    }
  `]
})
export class FeaturesComponent {
}