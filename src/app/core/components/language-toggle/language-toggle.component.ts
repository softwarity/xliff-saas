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
  templateUrl: 'language-toggle.component.html',
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
  private boundCloseMenu: (() => void) | null = null;

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
      this.boundCloseMenu = this.closeDropdown.bind(this);
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
    if (this.boundCloseMenu) {
      document.body.removeEventListener('click', this.boundCloseMenu);
      this.boundCloseMenu = null;
    }
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