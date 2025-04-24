// faq.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-reviews',
  standalone: true,
  template: `
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12 dark:text-white" i18n="@@TESTIMONIALS_TITLE">What Our Clients Say</h2>
      <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div class="p-6 rounded-lg bg-light-surface dark:bg-dark-700 border border-light-border dark:border-dark-600">
          <p class="text-gray-600 dark:text-gray-300 mb-4" i18n="@@TESTIMONIAL_1">XLIFF Translator has revolutionized our localization workflow. The context-aware translations are incredibly accurate.</p>
          <p class="font-semibold dark:text-white" i18n="@@TESTIMONIAL_1_AUTHOR">John Doe - Tech Lead at GlobalTech</p>
        </div>
        <div class="p-6 rounded-lg bg-light-surface dark:bg-dark-700 border border-light-border dark:border-dark-600">
          <p class="text-gray-600 dark:text-gray-300 mb-4" i18n="@@TESTIMONIAL_2">The automated Git integration saved us countless hours of manual work. Highly recommended!</p>
          <p class="font-semibold dark:text-white" i18n="@@TESTIMONIAL_2_AUTHOR">Jane Smith - CTO at WebScale</p>
        </div>
      </div>
    </div>
  `,
})
export class ReviewsComponent {
}