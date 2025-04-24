import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../../environments/environment';
import '../../../web-components/theme-switcher';
import { AuthService } from '../../services/auth.service';
import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';
import { LoggedNavComponent } from './logged-nav.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    LanguageToggleComponent,
    LoggedNavComponent,
    NgClass
  ],
  template: `
  <div class="w-full bg-white dark:bg-gray-800 shadow-sm" [ngClass]="{'!bg-tertiary': dev}">
    <nav class="w-full px-4 py-2">
      <div class="flex items-center space-x-4">
        <a routerLink="/" class="text-primary dark:text-blue-400 shrink-0 flex items-center">
          <img src="assets/softwarity.png" alt="Softwarity Logo" class="h-10 w-10 mr-4 logo-filter" />
          <span class="hidden md:flex md:flex-col">
            <span class="text-2xl font-bold line-h-1px">XLIFF</span>
            <span class="text-lg line-h-1px">Translator</span>
          </span>
        </a>

        <a routerLink="/how-it-works" routerLinkActive="!text-primary dark:!text-blue-400" class="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 xl:hidden" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="M734-133q-6 0-11-2t-10-7L515-339q-5-5-7-10t-2-11q0-6 2-11t7-10l61-61q5-5 10-7t11-2q6 0 11 2t10 7l198 198q5 5 7 10t2 11q0 6-2 11t-7 10l-61 60q-5 5-10 7t-11 2Zm0-26 64-64-201-201-64 64 201 201Zm-509 26q-6 0-11-2t-10-7l-61-60q-5-5-7-10t-2-11q0-6 2-11.5t7-10.5l204-204h83l30-30-171-171h-57l-95-95 77-77 95 95v57l171 171 122-122-83-83 42-42h-84l-13-12 105-105 12 12v85l42-42 164 162q14 13 20.5 30t6.5 36q0 12-3 23.5t-9 22.5l-81-81-57 57-43-43-172 172v85L246-142q-5 5-10 7t-11 2Zm0-27 205-205v-64h-64L161-224l64 64Zm0 0-64-64 32 32 32 32Zm509 1 64-64-64 64Z"/>
          </svg>
          <span class="hidden xl:inline" i18n="@@NAVIGATION_HOW_IT_WORKS">How It Works</span>
        </a>

        <a routerLink="/documentation" routerLinkActive="!text-primary dark:!text-blue-400" class="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 xl:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span class="hidden xl:inline" i18n="@@NAVIGATION_DOCUMENTATION">Documentation</span>
        </a>
        <a routerLink="/pricing" routerLinkActive="!text-primary dark:!text-blue-400" class="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 xl:hidden" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="M534-470q-29 0-48.5-19.5T466-538q0-29 19.5-48.5T534-606q29 0 48.5 19.5T602-538q0 29-19.5 48.5T534-470ZM296-340q-24.75 0-42.37-17.63Q236-375.25 236-400v-276q0-24.75 17.63-42.38Q271.25-736 296-736h476q24.75 0 42.38 17.62Q832-700.75 832-676v276q0 24.75-17.62 42.37Q796.75-340 772-340H296Zm28-28h420q0-25 17.63-42.5Q779.25-428 804-428v-220q-25 0-42.5-17.63Q744-683.25 744-708H324q0 25-17.62 42.5Q288.75-648 264-648v220q25 0 42.5 17.62Q324-392.75 324-368Zm390 136H188q-24.75 0-42.37-17.63Q128-267.25 128-292v-326h28v326q0 12 10 22t22 10h526v28ZM296-368h-32v-340h32q-13 0-22.5 9.5T264-676v276q0 13 9.5 22.5T296-368Z"/>
          </svg>
          <span class="hidden xl:inline" i18n="@@PRICING_BUTTON">Pricing</span>
        </a>
        @if (isAuthenticated()) {
          <app-logged-nav class="flex-1"></app-logged-nav>
        } @else {
          <div class="flex-1"></div>
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
  styles: [`
    :host-context(.dark) .logo-filter {
      filter: invert(0.5)  brightness(1.3);
    }
    .line-h-1px {
      line-height: 1rem !important;
    }
  `],
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