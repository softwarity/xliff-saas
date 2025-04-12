import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  styles: [`
    input.error {
      @apply border-red-500;
    }
  `],
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="bg-light-surface dark:bg-dark-800 border border-light-border dark:border-dark-600 rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 class="text-2xl font-bold text-center mb-6" i18n="@@AUTH_LOGIN_TITLE">Sign In</h1>
        <!-- border-red-500 -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="email" i18n="@@AUTH_LOGIN_EMAIL">Email</label>
            <input class="w-full" type="email" id="email" formControlName="email" [class.error]="password.invalid && password.touched" autocomplete="current-password"/>
            @if (email.invalid && email.touched) {
              <div class="text-sm text-red-500">
                @if (email.errors?.['required']) {
                  <span i18n="@@AUTH_LOGIN_EMAIL_REQUIRED">Email is required</span>
                }
                @if (email.errors?.['email']) {
                  <span i18n="@@AUTH_LOGIN_EMAIL_INVALID">Please enter a valid email</span>
                }
              </div>
            }
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="password" i18n="@@AUTH_LOGIN_PASSWORD">Password</label>
            <input class="w-full" type="password" id="password" formControlName="password" [class.error]="password.invalid && password.touched" autocomplete="current-password"/>
            @if (password.invalid && password.touched) {
              <div class="text-sm text-red-500">
                @if (password.errors?.['required']) {
                  <span i18n="@@AUTH_LOGIN_PASSWORD_REQUIRED">Password is required</span>
                }
              </div>
            }
          </div>

          @if (error()) {
            <div class="text-sm text-red-500 mb-4">
              <span>{{ error() }}</span>
              @if (isEmailNotConfirmed()) {
                <div class="mt-2">
                  <button type="button" (click)="resendConfirmation()" [disabled]="isResending()" class="text-primary hover:underline" i18n="@@AUTH_LOGIN_RESEND_CONFIRMATION">Resend confirmation email</button>
                </div>
              }
            </div>
          }

          <button type="submit" [disabled]="loginForm.invalid || isLoading()" class="flat-primary w-full">
            @if (!isLoading()) {
              <span i18n="@@AUTH_LOGIN_SIGN_IN">Sign In</span>
            } @else {
              <span i18n="@@AUTH_LOGIN_SIGNING_IN">Signing in...</span>
            }
          </button>
        </form>

        <div class="separator">
          <span i18n="@@AUTH_LOGIN_OR">or</span>
        </div>

        <button (click)="signInWithGoogle()" [disabled]="isLoading()" class="stroke-primary w-full">
          <span i18n="@@AUTH_LOGIN_SIGN_IN_WITH_GOOGLE">Sign in with Google</span>
        </button>

        <div class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 space-x-2">
          <span i18n="@@AUTH_LOGIN_NO_ACCOUNT">Don't have an account?</span>
          <a class="text-primary hover:text-primary-hover font-medium" routerLink="/auth/signup" i18n="@@AUTH_LOGIN_SIGN_UP">Sign Up</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  isResending = signal(false);
  error = signal<string | null>(null);
  isEmailNotConfirmed = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  get email() { return this.loginForm.get('email') as FormControl; }
  get password() { return this.loginForm.get('password') as FormControl; }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.error.set(null);
    this.isEmailNotConfirmed.set(false);

    this.authService.signInWithEmail(this.email.value, this.password.value).subscribe({
      next: () => {
        console.log('Sign in with email success');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.isLoading.set(false);
        // Détection spécifique d'email non confirmé
        let message = err.message;
        if (err.message.includes('Email not confirmed') || err.message.includes('Email link is invalid or has expired')) {
          this.isEmailNotConfirmed.set(true);
          message = $localize `:@@AUTH_LOGIN_EMAIL_NOT_CONFIRMED:Your email has not been confirmed. Please check your inbox or request a new confirmation email.`;
        }
        this.error.set(message);
      }
    });
  }

  resendConfirmation(): void {
    if (!this.email.value) return;
    
    this.isResending.set(true);
    this.authService.resendConfirmationEmail(this.email.value).subscribe({
      next: () => {
        this.isResending.set(false);
        this.router.navigate(['/auth/email-confirmation'], { queryParams: { email: this.email.value } });
      },
      error: (err) => {
        this.isResending.set(false);
        this.error.set($localize `:@@AUTH_LOGIN_RESEND_ERROR:Error sending confirmation email: ${err.message}`);
      }
    });
  }

  signInWithGoogle(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.authService.signInWithGoogle().subscribe({
      next: () => {
        console.log('Sign in with Google success');
        // this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);

        console.error('Login error:', err);
        this.error.set(err.message);
      }
    });
  }
}