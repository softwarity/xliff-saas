import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';

interface Link {
  url: string;
  name: string;
}
@Component({
  selector: 'app-other-products',
  standalone: true,
  imports: [],
  template: `
  <div class="relative">
    <button (click)="toggleDropdown($event)" class="flat-ghost !p-2 flex items-center"
      aria-label="Change language" title="Change language" i18n-title="@@CHANGE_LANGUAGE">
      <span class="text-gray-800 dark:text-gray-200 text-sm font-medium" i18n="@@OTHER_PRODUCTS">Others</span>
      <svg class="w-4 h-4 ml-1 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    @if (isOpen()) {
      <div class="absolute right-0 mt-1 py-2 w-48 bg-white dark:bg-dark-700 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-600" (click)="closeDropdown()">
        @for (link of links(); track link.url) {
          <a [href]="link.url" target="_blank" class="w-full gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600 inline-flex cursor-pointer">
            <span>{{ link.name }}</span>
          </a>
        }
      </div>
    }
  </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class OtherProductsComponent {
  private platformId = inject(PLATFORM_ID);
  links = signal<Link[]>([
    {
      url: 'https://github.com/softwarity/angular-i18n-cli',
      name: 'angular-i18n-cli'
    },
    {
      url: 'https://softwarity.io',
      name: 'Archway App Gateway'
    }
  ]);
  isOpen = signal(false);
  private boundCloseMenu: (() => void) = this.closeDropdown.bind(this);

  protected toggleDropdown(event: Event): void {
    // event.stopPropagation();
    if (!this.isOpen()) {
      this.isOpen.set(true);
      setTimeout((obj: any) => {
        if (isPlatformBrowser(this.platformId)) {
          document.body.addEventListener('click', obj.boundCloseMenu);
        }
      }, 100, this);
    } else {
      this.closeDropdown();
    }
  }

  closeDropdown(): void {
    this.isOpen.set(false);
    document.body.removeEventListener('click', this.boundCloseMenu);
  }
}