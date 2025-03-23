import { HttpClient } from '@angular/common/http';
import { Component, effect, signal } from '@angular/core';

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
  languages = signal<Language[]>([]);
  currentLang = signal<string>('en');
  isOpen = signal(false);
  baseUrl = signal<string>('');
  constructor(private http: HttpClient) {
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
  

  protected toggleDropdown(event: Event): void {
    event.stopPropagation();
    if (!this.isOpen()) {
      this.isOpen.set(true);
      document.body.addEventListener('click', this.closeDropdown.bind(this));
    } else {
      this.closeDropdown();
    }
  }

  closeDropdown(): void {
    this.isOpen.set(false);
    document.body.removeEventListener('click', this.closeDropdown);
  }

  getFragments() {
    const baseObj = document.querySelector('base') || document.querySelector('#base');
    const base =  (baseObj?.href || '').replace(document.location.origin, '');
    return base.split('/').filter(Boolean);
  }

  changeLanguage(lang: string) {
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