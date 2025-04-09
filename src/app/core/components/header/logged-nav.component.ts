import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import '../../../web-components/icon';
import '../../../web-components/theme-switcher';
import { AuthService } from '../../services/auth.service';
import { BalanceService } from '../../services/balance.service';
import { GitProviderService } from '../../services/git-provider.service';
import { LoggedButtonComponent } from './logged-button.component';
@Component({
  selector: 'app-logged-nav',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    CommonModule,
    LoggedButtonComponent
  ],
  template: `
    <div class="flex items-center space-x-2 md:space-x-4">
      <a routerLink="/dashboard" routerLinkActive="!text-primary dark:!text-blue-400" class="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 xl:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span class="hidden xl:inline" i18n="@@NAVIGATION_DASHBOARD">Dashboard</span>
      </a>
      <a routerLink="/git-providers" routerLinkActive="!text-primary dark:!text-blue-400" class="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 xl:hidden" width="92pt" height="92pt" viewBox="0 0 92 92">
          <path style="stroke:none;fill-rule:nonzero;fill:#f03b2e93;fill-opacity:1" d="M90.156 41.965 50.036 1.848a5.918 5.918 0 0 0-8.372 0l-8.328 8.332 10.566 10.566a7.03 7.03 0 0 1 7.23 1.684 7.034 7.034 0 0 1 1.669 7.277l10.187 10.184a7.028 7.028 0 0 1 7.278 1.672 7.04 7.04 0 0 1 0 9.957 7.05 7.05 0 0 1-9.965 0 7.044 7.044 0 0 1-1.528-7.66l-9.5-9.497V59.36a7.04 7.04 0 0 1 1.86 11.29 7.04 7.04 0 0 1-9.957 0 7.04 7.04 0 0 1 0-9.958 7.06 7.06 0 0 1 2.304-1.539V33.926a7.049 7.049 0 0 1-3.82-9.234L29.242 14.272 1.73 41.777a5.925 5.925 0 0 0 0 8.371L41.852 90.27a5.925 5.925 0 0 0 8.37 0l39.934-39.934a5.925 5.925 0 0 0 0-8.371"/>
        </svg>
        <span class="hidden xl:inline" i18n="@@NAVIGATION_GIT_PROVIDERS">Git Providers</span>
      </a>
      @for (provider of getConnectedProviders(); track provider.type) {
        <a [routerLink]="['/repositories', provider.type]" routerLinkActive="!text-primary dark:!text-blue-400" class="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors p-2">
          @if (provider.type === 'github') {
            <app-icon name="github" size="24" fill="currentColor" class="h-5 w-5 md:h-6 md:w-6 md:mr-2"/>
          } @else if (provider.type === 'gitlab') {
            <app-icon name="gitlab" size="24" fill="currentColor" class="h-5 w-5 md:h-6 md:w-6 md:mr-2"/>
          } @else if (provider.type === 'bitbucket') {
            <app-icon name="bitbucket" size="24" fill="currentColor" class="h-5 w-5 md:h-6 md:w-6 md:mr-2"/>
          }
          <span class="hidden md:inline">{{ provider.name }}</span>
        </a>
      }
      <div class="flex-1"></div>
      @if (balance() === 0) {
        <button  class="flat-secondary" i18n="@@PURCHASE_CREDITS_BUTTON">Purchase credits</button>
      } @else {
        <button class="flat-primary" i18n="@@BALANCE_BUTTON">{{ balance() }} credits</button>
      }
      <app-logged-button></app-logged-button>
    </div>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoggedNavComponent {
  private auth = inject(AuthService);
  private gitProviderService = inject(GitProviderService);
  private balanceService = inject(BalanceService);
  private subscriptions: Subscription = new Subscription();
  balance = signal<number>(0);
  isCustomAIInstructionsModalOpen = signal(false);

  protected showAuthForm = signal(false);
  protected isRegistering = signal(false);
  randomId = signal(Math.random().toString(36).substring(2, 15));

  protected isAuthenticated = toSignal(this.auth.isAuthenticated$, { initialValue: false });
  protected user = toSignal(this.auth.user$);
  protected providers = toSignal(this.gitProviderService.providers$, { initialValue: [] });

  constructor() {
    this.subscriptions.add(this.balanceService.subscribeToBalanceChanges().subscribe({
      next: (balance: number) => {
        this.balance.set(balance);
      },
      error: (error) => {
        this.balance.set(0);
        console.error('Error subscribing to credit changes:', error);
      }
    }));
  }

  protected getConnectedProviders() {
    return this.providers().filter(p => p.connected);
  }
}