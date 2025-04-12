import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="bg-light-surface dark:bg-dark-800 border border-light-border dark:border-dark-600 rounded-lg shadow-md p-8 w-full max-w-4xl">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold mb-4" i18n="@@TERMS_TITLE">Terms of Service</h1>
          <p class="text-gray-600 dark:text-gray-400" i18n="@@TERMS_LAST_UPDATED">Last updated: April 16, 2024</p>
        </div>

        <div class="prose dark:prose-invert max-w-none">
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4" i18n="@@TERMS_INTRODUCTION">Introduction</h2>
            <p i18n="@@TERMS_INTRO_TEXT">Welcome to our translation service. By using our service, you agree to these terms. Please read them carefully.</p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4" i18n="@@TERMS_ACCOUNT">Account Terms</h2>
            <ul class="list-disc pl-6 space-y-2">
              <li i18n="@@TERMS_ACCOUNT_1">You must be 18 years or older to use this service</li>
              <li i18n="@@TERMS_ACCOUNT_2">You must provide accurate information when creating an account</li>
              <li i18n="@@TERMS_ACCOUNT_3">You are responsible for maintaining the security of your account</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4" i18n="@@TERMS_SERVICE">Service Usage</h2>
            <p i18n="@@TERMS_SERVICE_TEXT">Our service is provided "as is" and we make no warranties about its reliability or availability. We reserve the right to modify or discontinue the service at any time.</p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4" i18n="@@TERMS_PAYMENT">Payment Terms</h2>
            <p i18n="@@TERMS_PAYMENT_TEXT">All payments are processed securely through our payment provider. Refunds are handled according to our refund policy.</p>
          </section>
        </div>

        <div class="mt-8 text-center">
          <a routerLink="/" class="button flat-primary" i18n="@@TERMS_GO_HOME">Go to home page</a>
        </div>
      </div>
    </div>
  `
})
export class TermsComponent {} 