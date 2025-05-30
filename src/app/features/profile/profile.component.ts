import { DatePipe, NgClass } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { from, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AvatarService } from './avatar.service';
import { PromptModalComponent } from '../../shared/components/prompt-modal.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [DatePipe, NgClass, PromptModalComponent, RouterLink],
  providers: [AvatarService],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center space-x-4 mb-6">
          <div 
            #avatarContainer class="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer relative overflow-hidden" 
            (click)="fileInput.click()">
            @if (!showDefaultAvatar() && avatarUrl()) {
              <img [src]="avatarUrl()" class="w-full h-full object-cover" alt="Profile avatar" (error)="showDefaultAvatar.set(true)">
            } @else {
              <div class="w-full h-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            }
            <input #fileInput type="file" class="hidden" accept="image/*" (change)="onFileSelected($event)">
            <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity duration-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white opacity-0 hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white truncate max-w-xs">{{ user()?.email }}</h1>
              <div class="flex items-center">
                <div class="h-10 w-10 flex items-center justify-center mr-2">
                  <!-- DIAMOND membership badge -->
                  @if (membershipLevel() === 'DIAMOND') {
                    <img src="assets/membership/diamond.svg" alt="Diamond membership badge" class="h-8 w-8">
                  }
                  <!-- GOLD membership badge -->
                  @else if (membershipLevel() === 'GOLD') {
                    <img src="assets/membership/gold.svg" alt="Gold membership badge" class="h-8 w-8">
                  }
                  <!-- SILVER membership badge -->
                  @else if (membershipLevel() === 'SILVER') {
                    <img src="assets/membership/silver.svg" alt="Silver membership badge" class="h-8 w-8">
                  }
                  <!-- BRONZE membership badge (default) -->
                  @else {
                    <img src="assets/membership/bronze.svg" alt="Bronze membership badge" class="h-8 w-8">
                  }
                </div>
                <div>
                  <span class="font-semibold text-sm" i18n="@@PROFILE_MEMBERSHIP_LEVEL">Membership</span>
                  <p class="text-sm" [ngClass]="{
                    'text-blue-500': membershipLevel() === 'DIAMOND',
                    'text-yellow-500': membershipLevel() === 'GOLD',
                    'text-gray-500': membershipLevel() === 'SILVER',
                    'text-amber-700': membershipLevel() === 'BRONZE'
                  }">{{ membershipLevel() }}</p>
                </div>
              </div>
            </div>
            <p class="text-gray-500 dark:text-gray-400" i18n="@@PROFILE_MEMBER_SINCE">Member since {{ user()?.created_at | date }}</p>
          </div>
        </div>

        <div class="space-y-6">
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4" i18n="@@PROFILE_ACCOUNT_INFO">Account Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" i18n="@@PROFILE_EMAIL_LABEL">Email</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ user()?.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" i18n="@@PROFILE_ROLE_LABEL">Role</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ user()?.role || 'User' }}</p>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4" i18n="@@PROFILE_ACTIONS">Actions</h2>
            <div class="space-y-4">
              <div class="flex justify-end space-x-4">
                <button class="flat-secondary" i18n="@@PROFILE_UPDATE_BUTTON">Update Profile</button>
                <a class="button flat-primary" routerLink="/auth/update-password" i18n="@@PROFILE_CHANGE_PASSWORD_BUTTON">Change Password</a>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4" i18n="@@PROFILE_DANGER_ZONE">Danger Zone</h2>
            <div class="space-y-4">
              <div class="flex justify-end">
                <button (click)="showDeleteModal = true" class="flat-warning" i18n="@@PROFILE_DELETE_ACCOUNT_BUTTON">Delete Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    @if (showDeleteModal) {
      <app-prompt-modal 
        title="Delete Account" i18n-title="@@PROFILE_DELETE_ACCOUNT_TITLE"
        description="Are you sure you want to delete your account?" i18n-description="@@PROFILE_DELETE_ACCOUNT_DESCRIPTION"
        warning="This action cannot be undone. All account data and credits will be permanently deleted." i18n-warning="@@PROFILE_DELETE_ACCOUNT_WARNING"
        instructions="Please enter your email address to confirm deletion." i18n-instructions="@@PROFILE_DELETE_ACCOUNT_INSTRUCTIONS"
        placeholder="Enter your email" i18n-placeholder="@@PROFILE_DELETE_ACCOUNT_PLACEHOLDER"
        (closed)="onDeleteModalClosed($event)"
      />
    }
  `
})
export class ProfileComponent {
  private router = inject(Router);
  private auth = inject(AuthService);
  private avatarService = inject(AvatarService);
  private toastService = inject(ToastService);
  
  user = signal<User | null>(null);
  isLoading = signal(false);
  protected avatarUrl = toSignal(this.auth.avatar$);
  protected showDefaultAvatar = signal(false);
  protected membershipLevel = signal<'DIAMOND' | 'GOLD' | 'SILVER' | 'BRONZE'>('BRONZE');
  showDeleteModal = false;

  constructor(
    private authService: AuthService
  ) {
    this.authService.getUser().pipe(
      catchError((error) => {
        console.error('Error getting user session:', error);
        this.toastService.error($localize `:@@AUTH_SERVICE_ERROR_GETTING_SESSION:Error getting user session`);
        return of(null);
      })
    ).subscribe(user => {
      if (user) {
        this.user.set(user);
        // Set membership level from app_metadata
        if (user.app_metadata && user.app_metadata['membershipLevel']) {
          this.membershipLevel.set(user.app_metadata['membershipLevel']);
        }
      }
    });

    effect(() => {
      if (this.avatarUrl()) {
        this.showDefaultAvatar.set(false);
      }
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      this.toastService.error($localize `:@@PROFILE_ERROR_INVALID_FILE_TYPE:File must be an image`);
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      this.toastService.error($localize `:@@PROFILE_ERROR_FILE_TOO_LARGE:File size must be less than 2MB`);
      return;
    }
    
    // Upload avatar
    this.avatarService.updateAvatar(file).subscribe();
  }

  onDeleteModalClosed(email: string | null) {
    this.showDeleteModal = false;
    const user = this.user();
    if (user && email && user.email === email) {
      from(this.auth.deleteAccount()).pipe(
        concatMap(() => this.auth.signOut())
      ).subscribe({
        next: () => {
          this.router.navigate(['/']);
        }
      });
    }
  }
} 