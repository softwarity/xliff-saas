import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AvatarService } from '../../services/avatar.service';
import { AuthService } from '../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="relative">
      <button 
        (click)="toggleMenu($event)"
        class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
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
        <div 
          class="absolute right-0 mt-1 min-w-[12rem] bg-white dark:bg-dark-700 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-600"
          (click)="$event.stopPropagation()"
        >
          <div class="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
            {{ (user$ | async)?.email }}
          </div>
          <a 
            routerLink="/profile" 
            class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600"
          >
            <span i18n="@@PROFILE_MENU_PROFILE">Profile</span>
          </a>
          <button 
            (click)="signOut()"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600"
          >
            <span i18n="@@PROFILE_MENU_LOGOUT">Logout</span>
          </button>
        </div>
      }
    </div>
  `
})
export class UserButtonComponent {
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
    this.auth.signOut();
  }
} 