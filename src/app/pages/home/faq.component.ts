// faq.component.ts
import { NgClass } from '@angular/common';
import { Component, computed, input, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="w-full max-w-4xl mx-auto rounded-lg shadow-md bg-white dark:bg-gray-800 p-4 md:p-6">
      <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white" i18n="@@FAQ_TITLE">Frequently Asked Questions</h2>
      @for (faq of _faqs(); track faq.question) {
        <div class="mb-4 last:mb-0">
          <div class="flex justify-between items-center p-4 rounded-md cursor-pointer transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600" (click)="toggleFaq(faq)">
            <h3 class="text-lg font-medium text-gray-800 dark:text-white">{{ faq.question }}</h3>
            <span class="text-xl transition-transform duration-300" [class.rotate-180]="faq.expanded()">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
          <div class="faq-content overflow-hidden transition-all duration-300 ease-in-out max-h-0 opacity-0" [ngClass]="{'expanded': faq.expanded()}">
            <div class="p-4 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-b-md mt-1">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    div.faq-content {
      transition: max-height 0.5s ease-in-out, opacity 0.3s ease-in-out;
    }
    div.faq-content.expanded {
      max-height: 500px;
      opacity: 1;
    }
  `]
})
export class FaqComponent {
  faqs = input<Faq[]>([]);

  _faqs = computed(() => this.faqs().map(faq => ({
    ...faq,
    expanded: signal(false)
  })));

  toggleFaq(faq: Faq & { expanded: WritableSignal<boolean> }): void {
    faq.expanded.update(expanded => !expanded);
  }
}