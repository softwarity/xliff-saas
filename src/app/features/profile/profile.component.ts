import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { concatMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AvatarService } from '../../core/services/avatar.service';
import { PromptModalComponent } from '../../shared/components/prompt-modal.component';
import { Router } from '@angular/router';
import { from } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AsyncPipe, DatePipe, PromptModalComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center space-x-4 mb-6">
          <div 
            #avatarContainer class="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer relative overflow-hidden" 
            (click)="fileInput.click()">
            @if (!showDefaultAvatar() && avatarUrl()) {
              <img [src]="avatarUrl()" class="w-full h-full object-cover"  alt="Profile avatar" (error)="showDefaultAvatar.set(true)">
            } @else {
              <div class="w-full h-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            }
            <input #fileInput type="file" class="hidden" accept="image/*" (change)="onFileSelected($event)" [disabled]="!isAuthenticated()">
            <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity duration-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white opacity-0 hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ user()?.email }}</h1>
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
                <button class="flat-secondary" i18n="@@PROFILE_UPDATE_BUTTON" [disabled]="!isAuthenticated()">Update Profile</button>
                <button class="flat-primary" i18n="@@PROFILE_CHANGE_PASSWORD_BUTTON" [disabled]="!isAuthenticated()">Change Password</button>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4" i18n="@@PROFILE_DANGER_ZONE">Danger Zone</h2>
            <div class="space-y-4">
              <div class="flex justify-end">
                <button (click)="showDeleteModal = true"  class="flat-warning" i18n="@@PROFILE_DELETE_ACCOUNT_BUTTON" [disabled]="!isAuthenticated()">Delete Account</button>
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
  `,
})
export class ProfileComponent {
  private router = inject(Router);
  private auth = inject(AuthService);
  private avatarService = inject(AvatarService);
  // protected user$ = this.auth.user$;
  protected user = toSignal(this.auth.user$);
  protected isAuthenticated = toSignal(this.auth.isAuthenticated$);
  protected avatarUrl = toSignal(this.avatarService.avatar$);
  protected showDefaultAvatar = signal(false);
  showDeleteModal = false;
  constructor() {
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
      console.error('File must be an image');
      return;
    }
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      console.error('File size must be less than 2MB');
      return;
    }
    // Upload avatar
    this.avatarService.updateAvatar(file).subscribe({
      error: (error) => {
        console.error('Error uploading avatar:', error);
      }
    });
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
        },
        error: (error) => {
          console.error('Error deleting account:', error);
        }
      });
    }
  }
} 