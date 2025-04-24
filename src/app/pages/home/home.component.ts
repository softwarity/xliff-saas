import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FaqComponent } from './faq.component';
import { FeaturesComponent } from './features.component';
import { TeamComponent } from './team.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FaqComponent,
    FeaturesComponent,
    // TeamComponent
  ],
  template: `
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-dark-900 dark:to-dark-800">
    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-20">
      <div class="text-center">
        <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-6" i18n="@@HOME_TITLE">Automated XLIFF Translation for Angular Applications</h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8" i18n="@@HOME_DESCRIPTION">Translate your Angular applications with AI-powered context-aware translations</p>
        <div class="space-x-4">
          <a routerLink="/documentation" class="button flat-primary !px-8 !py-3 rounded-lg font-medium" i18n="@@GET_STARTED">Get Started</a>
          <a routerLink="/how-it-works" class="button stroke-primary !px-8 !py-3 rounded-lg font-medium" i18n="@@LEARN_MORE">Learn More</a>
        </div>

      </div>
    </section>

    <!-- Section Separator -->
    <div class="h-px bg-gradient-to-r from-transparent via-light-border dark:via-dark-600 to-transparent"></div>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-light-background dark:bg-dark-800">
      <app-features></app-features>
    </section>

    <!-- Section Separator -->
    <div class="h-px bg-gradient-to-r from-transparent via-light-border dark:via-dark-600 to-transparent"></div>

    <!-- FAQ Section -->
    <section class="my-16">
      <app-faq [faqs]="faqList"></app-faq>
    </section>

    <!-- Section Separator -->
    <div class="h-px bg-gradient-to-r from-transparent via-light-border dark:via-dark-600 to-transparent"></div>

    <!-- Testimonials Section -->
    <section class="bg-white dark:bg-dark-800">
      <!-- TODO: Add Team presentation -->
      <!-- <app-team></app-team> -->
    </section>
  </div>
  `
})
export class HomeComponent {
  private auth = inject(AuthService);
  protected isAuthenticated = toSignal(this.auth.isAuthenticated$, { initialValue: false });
  faqList: Faq[] = [
    {
      question: $localize`:@@HOW_CAN_XLIFF_TRANSLATOR_HELP_MY_BUSINESS:How can XLIFF Translator help my business?`,
      answer: $localize`:@@HOW_CAN_XLIFF_TRANSLATOR_HELP_MY_BUSINESS_ANSWER:XLIFF Translator simplifies the management of your application's translations by using AI to automatically generate accurate translations. This saves you time and money while improving the quality of your translations.`
    },
    {
      question: $localize`:@@CAN_I_TRY_XLIFF_TRANSLATOR_BEFORE_SIGNING_UP:Can I try XLIFF Translator before signing up?`,
      answer: $localize`:@@CAN_I_TRY_XLIFF_TRANSLATOR_BEFORE_SIGNING_UP_ANSWER:Yes, we offer welcome credits upon registration that allow you to test the features of our platform without any commitment. You can see for yourself how our solution can improve your translation process.`
    },
    {
      question: $localize`:@@WHAT_LANGUAGES_ARE_SUPPORTED:What languages are supported?`,
      answer: $localize`:@@WHAT_LANGUAGES_ARE_SUPPORTED_ANSWER:XLIFF Translator supports all commonly used languages worldwide. You can even attempt to translate non-human languages like Klingon or Elvish, but the results may not be optimal.`
    },
    {
      question: $localize`:@@HOW_DOES_XLIFF_TRANSLATOR_COMPARE_TO_OTHER_TRANSLATION_TOOLS:How does XLIFF Translator compare to other translation tools?`,
      answer: $localize`:@@HOW_DOES_XLIFF_TRANSLATOR_COMPARE_TO_OTHER_TRANSLATION_TOOLS_ANSWER:Unlike generic translation tools, XLIFF Translator is specifically designed for XLIFF files used in Angular application development. Our AI technology understands the technical context and preserves tags and interpolations, ensuring accurate and functional translations.`
    },
    {
      question: $localize`:@@CAN_I_INTEGRATE_XLIFF_TRANSLATOR_INTO_MY_EXISTING_DEVELOPMENT_PROCESS:Can I integrate XLIFF Translator into my existing development process?`,
      answer: $localize`:@@CAN_I_INTEGRATE_XLIFF_TRANSLATOR_INTO_MY_EXISTING_DEVELOPMENT_PROCESS_ANSWER:Absolutely! XLIFF Translator easily integrates into your existing workflows. When your application needs to be translated, you just need to initiate the translation through our interface and wait for the Pull Request on your Git repository.`
    },
    {
      question: $localize`:@@HOW_LONG_DOES_IT_TAKE_TO_TRANSLATE_AN_APPLICATION:How long does it take to translate an application?`,
      answer: $localize`:@@HOW_LONG_DOES_IT_TAKE_TO_TRANSLATE_AN_APPLICATION_ANSWER:It depends on the size and complexity of the application. On average, a TransUnit (XLIFF Translation Unit) is translated in about twelve seconds. An application or website with 1000 TransUnits is already substantial. You then multiply by the number of languages to be translated. 1000 * 12 = 12,000 seconds, which is 3 hours and 20 minutes.`
    },
    {
      question: $localize`:@@WHAT_IS_THE_PRICE_OF_XLIFF_TRANSLATOR:What is the price of XLIFF Translator?`,
      answer: $localize`:@@WHAT_IS_THE_PRICE_OF_XLIFF_TRANSLATOR_ANSWER:XLIFF Translator is a service that uses AI to translate your XLIFF files. This, of course, comes at a cost, as well as the operational processes. Registration is free with welcome credits. You can then purchase additional credits based on your needs.`
    }
  ];
}