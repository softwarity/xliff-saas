import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';

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
  private languageService = inject(LanguageService);
  
  protected isOpen = false;
  protected currentLang = this.languageService.getCurrentLanguage();
  protected languages = this.languageService.getAvailableLanguages();

  protected toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  protected getCurrentLanguage(): string {
    return this.currentLang.toUpperCase();
  }

  protected getLanguageLabel(code: string): string {
    return `${this.languageService.getLanguageName(code)}`;
  }
}