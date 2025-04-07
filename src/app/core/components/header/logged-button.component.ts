import { AsyncPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { AvatarService } from '../../services/avatar.service';
import '../../../web-components/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logged-button',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [`
    :host {
      position: relative;
    }
    .menu-item {
      @apply w-full gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600 inline-flex;
    }
    a.menu-item {
      @apply cursor-pointer;
    }
  `],
  template: `
    <button (click)="toggleMenu($event)" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
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
    @if (isMenuOpen) {
      <div class="absolute right-0 mt-1 min-w-[12rem] bg-white dark:bg-dark-700 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-600">
        <div class="menu-item">
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
        <a routerLink="/profile" class="menu-item">
          <span i18n="@@YOUR_PROFILE">Your profile</span>
        </a>
        <!-- Lien temporaire pour le test Stripe -->
        <a routerLink="/stripe-test" class="menu-item">
          <span i18n="@@STRIPE_TEST">Stripe Test</span>
        </a>
        <span class="flex border-b border-gray-200 dark:border-gray-600"></span>
        <button (click)="signOut()" class="menu-item">
          <span i18n="@@PROFILE_MENU_LOGOUT">Logout</span>
        </button>
      </div>
    }
  `
})
export class LoggedButtonComponent {
  private avatarService = inject(AvatarService);
  private auth = inject(AuthService);
  private boundCloseMenu: (() => void) | null = null;

  protected user$ = this.auth.user$;
  protected isMenuOpen = false;
  protected avatar = toSignal(this.avatarService.avatar$);
  protected showDefaultAvatar = signal(false);

  constructor() {
    effect(() => {
      if (this.avatar()) {
        this.showDefaultAvatar.set(false);
      }
    });
  }

  toggleMenu(event: Event): void {
    if (!this.isMenuOpen) {
      this.isMenuOpen = true;
      this.boundCloseMenu = this.closeMenu.bind(this);
      setTimeout((obj: any) => {
        document.body.addEventListener('click', obj.boundCloseMenu);
      }, 100, this);
    } else {
      this.closeMenu();
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    if (this.boundCloseMenu) {
      document.body.removeEventListener('click', this.boundCloseMenu);
      this.boundCloseMenu = null;
    }
  }

  signOut() {
    this.auth.signOut().subscribe();
  }
} 