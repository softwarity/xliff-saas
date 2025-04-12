import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="bg-light-surface dark:bg-dark-800 border border-light-border dark:border-dark-600 rounded-lg shadow-md p-8 w-full max-w-md">
        <div class="text-center mb-6">
          <svg class="mx-auto h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <h1 class="text-2xl font-bold mb-2" i18n="@@VERIFY_EMAIL_TITLE">Email successfully verified!</h1>
          <p class="text-gray-600 dark:text-gray-400" i18n="@@VERIFY_EMAIL_MESSAGE">Your email has been verified. You can now use all features of the application.</p>
        </div>

        <div class="mt-6 text-center">
          <a routerLink="/" class="button flat-primary" i18n="@@VERIFY_EMAIL_GO_HOME">Go to home page</a>
        </div>
      </div>
    </div>
  `
})
export class VerifyEmailComponent {} 