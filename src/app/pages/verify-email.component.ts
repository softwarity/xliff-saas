import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-8 max-w-md w-full">
        <div class="text-center mb-6">
          <svg class="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-2" i18n="@@VERIFY_EMAIL_TITLE">Email successfully verified!</h1>
          <p class="text-gray-600 dark:text-gray-300" i18n="@@VERIFY_EMAIL_MESSAGE">Your email has been verified. You can now use all features of the application.</p>
        </div>

        <div class="mt-6 text-center">
          <a routerLink="/" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" i18n="@@VERIFY_EMAIL_GO_HOME">Go to home page</a>
        </div>
      </div>
    </div>
  `
})
export class VerifyEmailComponent {} 