import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import '../../../web-components/theme-switcher';
import { AuthService } from '../../services/auth.service';
import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';
import { LoggedNavComponent } from './logged-nav.component';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { PurchaseCreditsButtonComponent } from '../../../shared/components/purchase-credits-button.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    PurchaseCreditsButtonComponent,
    LanguageToggleComponent,
    LoggedNavComponent,
    NgClass
  ],
  template: `
  <div class="w-full bg-white dark:bg-gray-800 shadow-sm" [ngClass]="{'!bg-tertiary': dev}">
    <nav class="w-full px-4 py-4">
      <div class="flex items-center space-x-4">
        <a routerLink="/" class="text-primary dark:text-blue-400 shrink-0">
          <span class="hidden md:flex md:flex-col">
            <span class="text-2xl font-bold">XLIFF</span>
            <span class="text-lg -mt-1">Translator</span>
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </a>

        <a routerLink="/how-it-works" routerLinkActive="!text-primary dark:!text-blue-400" class="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 xl:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="hidden xl:inline" i18n="@@NAVIGATION_HOW_IT_WORKS">How It Works</span>
        </a>

        <a routerLink="/documentation" routerLinkActive="!text-primary dark:!text-blue-400" class="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 xl:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span class="hidden xl:inline" i18n="@@NAVIGATION_DOCUMENTATION">Documentation</span>
        </a>
        @if (isAuthenticated()) {
          <app-logged-nav class="flex-1"></app-logged-nav>
        } @else {
          <div class="flex-1"></div>
          <app-purchase-credits-button buttonClass="flat-secondary"></app-purchase-credits-button>
          <a class="button flat-primary" routerLink="/auth/login" i18n="@@AUTH_SIGN_IN_BUTTON">Sign In</a>
        }
        <app-language-toggle></app-language-toggle>
        @if (isBrowser) {
          <theme-switcher attribute="class"
            title-dark="Dark mode" i18n-title-dark="@@THEME_TOGGLE_TO_DARK"
            title-light="Light mode" i18n-title-light="@@THEME_TOGGLE_TO_LIGHT"
            title-system="System preference" i18n-title-system="@@THEME_TOGGLE_TO_SYSTEM"
          ></theme-switcher>
        }
      </div>
    </nav>
  </div>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderComponent {
  private platformId: Object = inject(PLATFORM_ID);
  dev = !environment.production;
  private auth = inject(AuthService);
  protected isAuthenticated = toSignal(this.auth.isAuthenticated$, { initialValue: false });
  protected user = toSignal(this.auth.user$);
  protected isBrowser = isPlatformBrowser(this.platformId);

}