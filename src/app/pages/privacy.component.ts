import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="bg-light-surface dark:bg-dark-800 border border-light-border dark:border-dark-600 rounded-lg shadow-md p-8 w-full max-w-4xl">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold mb-4" i18n="@@PRIVACY_TITLE">Privacy Policy</h1>
          <p class="text-gray-600 dark:text-gray-400" i18n="@@PRIVACY_LAST_UPDATED">Last updated: April 16, 2024</p>
        </div>

        <div class="prose dark:prose-invert max-w-none">
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4" i18n="@@PRIVACY_INTRODUCTION">Introduction</h2>
            <p i18n="@@PRIVACY_INTRO_TEXT">We are committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information.</p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4" i18n="@@PRIVACY_COLLECTION">Information We Collect</h2>
            <ul class="list-disc pl-6 space-y-2">
              <li i18n="@@PRIVACY_COLLECTION_1">Account information (email, name)</li>
              <li i18n="@@PRIVACY_COLLECTION_2">Usage data and analytics</li>
              <li i18n="@@PRIVACY_COLLECTION_3">Payment information (processed securely)</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4" i18n="@@PRIVACY_USE">How We Use Your Information</h2>
            <p i18n="@@PRIVACY_USE_TEXT">We use your information to provide and improve our service, process payments, and communicate with you about your account.</p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4" i18n="@@PRIVACY_PROTECTION">Data Protection</h2>
            <p i18n="@@PRIVACY_PROTECTION_TEXT">We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
          </section>
        </div>

        <div class="mt-8 text-center">
          <a routerLink="/" class="button flat-primary" i18n="@@PRIVACY_GO_HOME">Go to home page</a>
        </div>
      </div>
    </div>
  `
})
export class PrivacyComponent {} 