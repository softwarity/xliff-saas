import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8" i18n="@@TERMS_TITLE">Terms of Service</h1>

          <div class="prose dark:prose-invert max-w-none">
            <p i18n="@@TERMS_INTRODUCTION">Welcome to our service. By using our service, you agree to these terms.</p>

            <h2 class="text-xl font-semibold mt-6 mb-4" i18n="@@TERMS_USAGE_TITLE">Usage Terms</h2>
            <p i18n="@@TERMS_USAGE_CONTENT">You may use our service for personal or commercial purposes, subject to these terms.</p>

            <h2 class="text-xl font-semibold mt-6 mb-4" i18n="@@TERMS_PRIVACY_TITLE">Privacy</h2>
            <p i18n="@@TERMS_PRIVACY_CONTENT">We respect your privacy. Please review our Privacy Policy for details.</p>
          </div>

          <div class="mt-8 text-center">
            <a routerLink="/" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" i18n="@@TERMS_BACK_HOME">Back to home</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TermsComponent {} 