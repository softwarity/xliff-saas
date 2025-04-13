import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="bg-light-surface dark:bg-dark-800 border border-light-border dark:border-dark-600 rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 class="text-2xl font-bold text-center mb-6" i18n="@@AUTH_UPDATE_PASSWORD_TITLE">Update Password</h1>
        
        <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="password" i18n="@@AUTH_UPDATE_PASSWORD_NEW_PASSWORD">New Password</label>
            <input class="w-full" type="password" id="password" formControlName="password" [class.error]="password.invalid && password.touched" autocomplete="new-password"/>
            @if (password.invalid && password.touched) {
              <div class="text-sm text-red-500">
                @if (password.errors?.['required']) {
                  <span i18n="@@AUTH_UPDATE_PASSWORD_PASSWORD_REQUIRED">Password is required</span>
                }
                @if (password.errors?.['minlength']) {
                  <span i18n="@@AUTH_UPDATE_PASSWORD_PASSWORD_MIN_LENGTH">Password must be at least 6 characters</span>
                }
              </div>
            }
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="confirmPassword" i18n="@@AUTH_UPDATE_PASSWORD_CONFIRM_PASSWORD">Confirm Password</label>
            <input class="w-full" type="password" id="confirmPassword" formControlName="confirmPassword" [class.error]="confirmPassword.invalid && confirmPassword.touched" autocomplete="new-password"/>
            @if (confirmPassword.invalid && confirmPassword.touched) {
              <div class="text-sm text-red-500">
                @if (confirmPassword.errors?.['required']) {
                  <span i18n="@@AUTH_UPDATE_PASSWORD_CONFIRM_PASSWORD_REQUIRED">Please confirm your password</span>
                }
                @if (confirmPassword.errors?.['passwordMismatch']) {
                  <span i18n="@@AUTH_UPDATE_PASSWORD_PASSWORDS_DONT_MATCH">Passwords don't match</span>
                }
              </div>
            }
          </div>

          @if (error()) {
            <div class="text-sm text-red-500 mb-4">
              <span>{{ error() }}</span>
            </div>
          }

          <button type="submit" [disabled]="passwordForm.invalid || isLoading()" class="flat-primary w-full">
            @if (!isLoading()) {
              <span i18n="@@AUTH_UPDATE_PASSWORD_UPDATE">Update Password</span>
            } @else {
              <span i18n="@@AUTH_UPDATE_PASSWORD_UPDATING">Updating password...</span>
            }
          </button>
        </form>
      </div>
    </div>
  `
})
export class UpdatePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  error = signal<string | null>(null);

  passwordForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  get password() { return this.passwordForm.get('password') as FormControl; }
  get confirmPassword() { return this.passwordForm.get('confirmPassword') as FormControl; }

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) return;
    this.isLoading.set(true);
    this.error.set(null);
    
    // TODO: Implement password update with Supabase
    this.isLoading.set(false);
    this.authService.updatePassword(this.password.value).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.log('Error updating password:', err);
        this.error.set(err.message);  
      }
    });
  }
} 