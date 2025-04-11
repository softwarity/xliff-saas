import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold mb-8" i18n="@@TERMS_TITLE">Terms of Service</h1>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4" i18n="@@TERMS_INTRODUCTION">Introduction</h2>
          <p class="mb-4" i18n="@@TERMS_INTRO_TEXT">
            Welcome to XLIFF Translator. By accessing or using our service, you agree to be bound by these Terms of Service.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4" i18n="@@TERMS_USE">Use of Service</h2>
          <p class="mb-4" i18n="@@TERMS_USE_TEXT">
            You may use our service only for lawful purposes and in accordance with these Terms. You agree not to use the service:
          </p>
          <ul class="list-disc pl-6 mb-4">
            <li i18n="@@TERMS_USE_1">In any way that violates any applicable law or regulation</li>
            <li i18n="@@TERMS_USE_2">To transmit any material that is defamatory, offensive, or otherwise objectionable</li>
            <li i18n="@@TERMS_USE_3">To interfere with or disrupt the service or servers</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4" i18n="@@TERMS_ACCOUNT">Account Terms</h2>
          <p class="mb-4" i18n="@@TERMS_ACCOUNT_TEXT">
            You are responsible for maintaining the security of your account and password. We cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4" i18n="@@TERMS_CHANGES">Changes to Terms</h2>
          <p class="mb-4" i18n="@@TERMS_CHANGES_TEXT">
            We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service.
          </p>
        </section>

        <div class="mt-8">
          <a routerLink="/" class="text-primary hover:underline" i18n="@@TERMS_BACK_HOME">Back to Home</a>
        </div>
      </div>
    </div>
  `
})
export class TermsComponent {} 