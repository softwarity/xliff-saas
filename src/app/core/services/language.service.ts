import { Injectable } from '@angular/core';
import * as xliffmergeConfig from '../../../../xliffmerge.json';

export interface Language {
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languages: Language[] = [
    { code: xliffmergeConfig.xliffmergeOptions.defaultLanguage, name: 'English' },
    ...xliffmergeConfig.xliffmergeOptions.languages.map(code => ({
      code,
      name: this.getLanguageName(code)
    }))
  ];

  getCurrentLanguage(): string {
    const path = window.location.pathname;
    const langMatch = path.match(/^\/([a-z]{2})\//);
    return langMatch ? langMatch[1] : xliffmergeConfig.xliffmergeOptions.defaultLanguage;
  }

  getAvailableLanguages(): Language[] {
    return this.languages;
  }

  getLanguageName(code: string): string {
    const names: Record<string, string> = {
      en: 'English',
      fr: 'Français',
      es: 'Español',
      de: 'Deutsch',
      it: 'Italiano',
      pt: 'Português',
      nl: 'Nederlands',
      pl: 'Polski',
      ru: 'Русский',
      ja: '日本語',
      ko: '한국어',
      zh: '中文'
    };
    return names[code] || code.toUpperCase();
  }
}