import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold mb-8" i18n="@@PRIVACY_TITLE">Privacy Policy</h1>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4" i18n="@@PRIVACY_INTRODUCTION">Introduction</h2>
          <p class="mb-4" i18n="@@PRIVACY_INTRO_TEXT">
            At XLIFF Translator, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4" i18n="@@PRIVACY_COLLECT">Information We Collect</h2>
          <p class="mb-4" i18n="@@PRIVACY_COLLECT_TEXT">
            We collect information that you provide directly to us, including:
          </p>
          <ul class="list-disc pl-6 mb-4">
            <li i18n="@@PRIVACY_COLLECT_1">Email address and account information</li>
            <li i18n="@@PRIVACY_COLLECT_2">Usage data and preferences</li>
            <li i18n="@@PRIVACY_COLLECT_3">Payment information (processed securely by our payment providers)</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4" i18n="@@PRIVACY_USE">How We Use Your Information</h2>
          <p class="mb-4" i18n="@@PRIVACY_USE_TEXT">
            We use the information we collect to:
          </p>
          <ul class="list-disc pl-6 mb-4">
            <li i18n="@@PRIVACY_USE_1">Provide and maintain our service</li>
            <li i18n="@@PRIVACY_USE_2">Process your transactions</li>
            <li i18n="@@PRIVACY_USE_3">Send you important updates and notifications</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4" i18n="@@PRIVACY_SECURITY">Security</h2>
          <p class="mb-4" i18n="@@PRIVACY_SECURITY_TEXT">
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <div class="mt-8">
          <a routerLink="/" class="text-primary hover:underline" i18n="@@PRIVACY_BACK_HOME">Back to Home</a>
        </div>
      </div>
    </div>
  `
})
export class PrivacyComponent {} 