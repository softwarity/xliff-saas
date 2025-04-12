import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8" i18n="@@PRIVACY_TITLE">Privacy Policy</h1>

          <div class="prose dark:prose-invert max-w-none">
            <p i18n="@@PRIVACY_INTRODUCTION">We are committed to protecting your privacy. This policy explains how we collect and use your information.</p>

            <h2 class="text-xl font-semibold mt-6 mb-4" i18n="@@PRIVACY_DATA_TITLE">Data Collection</h2>
            <p i18n="@@PRIVACY_DATA_CONTENT">We collect information that you provide directly to us, such as your email address and usage data.</p>

            <h2 class="text-xl font-semibold mt-6 mb-4" i18n="@@PRIVACY_USE_TITLE">How We Use Your Data</h2>
            <p i18n="@@PRIVACY_USE_CONTENT">We use your data to provide and improve our services, and to communicate with you.</p>
          </div>

          <div class="mt-8 text-center">
            <a routerLink="/" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" i18n="@@PRIVACY_BACK_HOME">Back to home</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PrivacyComponent {} 