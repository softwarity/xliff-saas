import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Component, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logged-button',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  schemas: [],
  styles: [`
    :host {
      position: relative;
    }
  `],
  template: `
    <button (click)="toggleDropdown($event)" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
      <div class="w-8 h-8 rounded-full overflow-hidden">
        @if (!showDefaultAvatar() && avatar()) {
          <img [src]="avatar()"  class="w-full h-full object-cover" alt="User avatar" (error)="showDefaultAvatar.set(true)">
        } @else {
          <div class="w-full h-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        }
      </div>
    </button>
    @if (isOpen()) {
      <div class="absolute right-0 mt-1 min-w-[12rem] bg-white dark:bg-dark-700 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-600">
        <div class="w-full gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600 inline-flex">
          {{ (user$ | async)?.email }}
        </div>
        <span class="flex border-b border-gray-200 dark:border-gray-600"></span>
        <!-- <div class="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
          <span i18n="@@THEME_TOGGLE_TITLE">Theme</span>
          <theme-switcher attribute="class"
              title-dark="Dark mode" i18n-title-dark="@@THEME_TOGGLE_TO_DARK"
              title-light="Light mode" i18n-title-light="@@THEME_TOGGLE_TO_LIGHT"
              title-system="System preference" i18n-title-system="@@THEME_TOGGLE_TO_SYSTEM"
            ></theme-switcher>
        </div> -->
        <a routerLink="/profile" class="w-full gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600 inline-flex cursor-pointer">
          <span i18n="@@YOUR_PROFILE">Your profile</span>
        </a>
        <a routerLink="/support" class="w-full gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600 inline-flex cursor-pointer">
          <span i18n="@@SUPPORT">Support</span>
        </a>
        <span class="flex border-b border-gray-200 dark:border-gray-600"></span>
        <button (click)="signOut()" class="w-full gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600 inline-flex">
          <span i18n="@@PROFILE_MENU_LOGOUT">Logout</span>
        </button>
      </div>
    }
  `
})
export class LoggedButtonComponent {
  private auth = inject(AuthService);
  private boundCloseMenu: (() => void) = this.closeMenu.bind(this);
  private platformId: Object = inject(PLATFORM_ID);

  protected user$ = this.auth.user$;
  isOpen = signal(false);
  protected avatar = toSignal(this.auth.avatar$);
  protected showDefaultAvatar = signal(false);

  constructor() {
    effect(() => {
      if (this.avatar()) {
        this.showDefaultAvatar.set(false);
      }
    });
  }

  protected toggleDropdown(event: Event): void {
    if (!this.isOpen()) {
      this.isOpen.set(true);
      setTimeout((obj: any) => {
        if (isPlatformBrowser(this.platformId)) {
          document.body.addEventListener('click', obj.boundCloseMenu);
        }
      }, 100, this);
    } else {
      this.closeMenu();
    }
  }

  closeMenu(): void {
    this.isOpen.set(false);
    document.body.removeEventListener('click', this.boundCloseMenu);
  }

  signOut() {
    this.auth.signOut().subscribe();
  }
} 