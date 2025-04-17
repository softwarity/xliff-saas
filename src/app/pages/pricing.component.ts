import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PriceGridComponent } from '../features/price-grid/price-grid.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, PriceGridComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4" i18n="@@PRICING_PAGE_TITLE">Translation Credits</h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" i18n="@@PRICING_PAGE_SUBTITLE">
          Purchase credits to translate your applications with AI power and unlock exclusive features
        </p>
      </div>
      
      <app-price-grid></app-price-grid>
      
      <div class="mt-16 text-center">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6" i18n="@@PRICING_FAQ_TITLE">Frequently Asked Questions</h2>
        
        <div class="max-w-3xl mx-auto space-y-6 text-left">
          <div class="bg-white dark:bg-dark-700 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2" i18n="@@PRICING_FAQ_WHAT_IS_UNIT">What is a translation unit?</h3>
            <p class="text-gray-600 dark:text-gray-300" i18n="@@PRICING_FAQ_WHAT_IS_UNIT_ANSWER">
              A translation unit corresponds to an element to be translated in your XLIFF file. Typically, this represents a sentence, label, or paragraph in your application interface.
            </p>
          </div>
          
          <div class="bg-white dark:bg-dark-700 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2" i18n="@@PRICING_FAQ_UNUSED_CREDITS">What happens to unused translation credits?</h3>
            <p class="text-gray-600 dark:text-gray-300" i18n="@@PRICING_FAQ_UNUSED_CREDITS_ANSWER">
              Your translation credits never expire. You can use them at any time for future translations.
            </p>
          </div>
          
          <div class="bg-white dark:bg-dark-700 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2" i18n="@@PRICING_FAQ_MEMBERSHIP_LEVELS">What are membership levels?</h3>
            <p class="text-gray-600 dark:text-gray-300" i18n="@@PRICING_FAQ_MEMBERSHIP_LEVELS_ANSWER">
              As you purchase credits, you'll unlock membership levels (Bronze, Silver, Gold, Diamond) that provide additional features and better rates for translations. Once you reach a level, you keep it permanently.
            </p>
          </div>
          
          <div class="bg-white dark:bg-dark-700 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2" i18n="@@PRICING_FAQ_SPECIAL_NEEDS">What if I have special requirements?</h3>
            <p class="text-gray-600 dark:text-gray-300" i18n="@@PRICING_FAQ_SPECIAL_NEEDS_ANSWER">
              If you have specific needs or require a custom solution, please contact our sales team. We'll be happy to create a tailored credit package for your organization.
            </p>
          </div>
        </div>
        
        <div class="mt-12">
          <a routerLink="/contact" class="button flat-primary" i18n="@@CONTACT_SALES">Contact Sales</a>
        </div>
      </div>
    </div>
  `
})
export class PricingComponent {} 