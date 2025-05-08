import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';

interface Language {
  code: string;
  name: string;
}
@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [],
  template: `
  <div class="relative">
    <button (click)="toggleDropdown($event)" class="flat-ghost !p-2 flex items-center"
      aria-label="Change language" title="Change language" i18n-title="@@CHANGE_LANGUAGE">
      <span class="text-gray-800 dark:text-gray-200 text-sm font-medium">{{ currentLang() }}</span>
      <svg class="w-4 h-4 ml-1 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    @if (isOpen()) {
      <div class="absolute right-0 mt-1 py-2 w-32 bg-white dark:bg-dark-700 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-600" (click)="closeDropdown()">
        @for (lang of languages(); track lang.code) {
          <button (click)="changeLanguage(lang.code)"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600"
            [class.font-semibold]="lang.code === currentLang()">
            {{ lang.name }}
        </button>
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
export class LanguageToggleComponent {
  private platformId = inject(PLATFORM_ID);
  languages = signal<Language[]>([]);
  currentLang = signal<string>('en');
  isOpen = signal(false);
  baseUrl = signal<string>('');
  private boundCloseMenu: (() => void) = this.closeDropdown.bind(this);

  constructor(private http: HttpClient) {
    if (isPlatformBrowser(this.platformId)) {
      this.http.get<Language[]>('assets/locales.json').subscribe(data => {
        this.languages.set(data.map(lang => ({
          code: lang.code,
          name: new Intl.DisplayNames([lang.code], { type: 'language' }).of(lang.code) || lang.code
        })));
      });
      const fragments = this.getFragments();
      const lg = fragments.pop() || 'en';
      this.currentLang.set(lg);
    }
  }
  

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

  getFragments() {
    if (isPlatformBrowser(this.platformId)) {
      const baseObj = document.querySelector('base') || document.querySelector('#base');
      const base =  (baseObj?.href || '').replace(document.location.origin, '');
      return base.split('/').filter(Boolean);
    }
    return [];
  }

  changeLanguage(lang: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('preferredLanguage', lang);
      const fragments = this.getFragments();
      fragments.pop();
      if (fragments.length > 0) {
        window.location.href = '/' + fragments.join('/') + '/' + lang + '/';
      } else {
        window.location.href = '/' + lang + '/';
      }
    }
  }
}