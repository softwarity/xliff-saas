import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="bg-light-surface dark:bg-dark-800 border border-light-border dark:border-dark-600 rounded-lg shadow-md p-8 w-full max-w-md">
        <div class="text-center mb-6">
          <svg class="mx-auto h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
          </svg>
          <h1 class="text-2xl font-bold mb-2" i18n="@@AUTH_EMAIL_CONFIRMATION_TITLE">Check your email</h1>
          <p class="text-gray-600 dark:text-gray-400" i18n="@@AUTH_EMAIL_CONFIRMATION_SUBTITLE">We sent you a confirmation link</p>
        </div>
        
        <div class="text-center mb-6">
          <p class="text-gray-700 dark:text-gray-300" i18n="@@AUTH_EMAIL_CONFIRMATION_MESSAGE">We have sent you an email with a confirmation link. Please check your inbox and click on the link to verify your email address.</p>
          @if (email()) {
            <p class="text-gray-600 dark:text-gray-400 mt-2" i18n="@@AUTH_EMAIL_CONFIRMATION_SENT_TO">Email sent to: {{ email() }}</p>
          }
          @if (resendError()) {
            <p class="text-red-500 mt-2">{{ resendError() }}</p>
          }
        </div>

        <div class="separator">
          <span i18n="@@AUTH_EMAIL_CONFIRMATION_OR">or</span>
        </div>

        <form [formGroup]="verificationForm" (ngSubmit)="verifyCode()" class="space-y-4">
          <div>
            <label for="code" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" i18n="@@AUTH_EMAIL_CONFIRMATION_CODE_LABEL">Verification Code</label>
            <input id="code" type="text" formControlName="code"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Enter the code from your email" i18n-placeholder="@@AUTH_EMAIL_CONFIRMATION_CODE_PLACEHOLDER"/>
            @if (verificationForm.get('code')?.invalid && verificationForm.get('code')?.touched) {
              <p class="mt-1 text-sm text-red-500" i18n="@@AUTH_EMAIL_CONFIRMATION_CODE_REQUIRED">Verification code is required</p>
            }
          </div>

          <button type="submit" [disabled]="verificationForm.invalid || isVerifying()" class="flat-primary w-full" >
            @if (isVerifying()) {
              <span i18n="@@AUTH_EMAIL_CONFIRMATION_VERIFYING">Verifying...</span>
            } @else {
              <span i18n="@@AUTH_EMAIL_CONFIRMATION_VERIFY">Verify Email</span>
            }
          </button>
        </form>

        <div class="separator">
          <span i18n="@@AUTH_EMAIL_CONFIRMATION_OR">or</span>
        </div>

        <button (click)="resendConfirmation()" [disabled]="isResending()" class="flat-primary w-full">
          @if (isResending()) { <span i18n="@@AUTH_EMAIL_CONFIRMATION_RESENDING">Resending...</span> } 
          @else { <span i18n="@@AUTH_EMAIL_CONFIRMATION_RESEND">Resend confirmation email</span> }
        </button>

        <div class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 space-x-2">
          <span i18n="@@AUTH_EMAIL_CONFIRMATION_BACK_TO_LOGIN">Back to</span>
          <a class="text-primary hover:text-primary-hover font-medium" routerLink="/auth/login" i18n="@@AUTH_EMAIL_CONFIRMATION_LOGIN">Login</a>
        </div>
      </div>
    </div>
  `
})
export class EmailConfirmationComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  isResending = signal(false);
  isVerifying = signal(false);
  email = signal<string | null>(null);
  resendError = signal<string | null>(null);
  verificationError = signal<string | null>(null);

  verificationForm = new FormGroup({
    code: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email.set(params['email']);
    });
  }

  verifyCode(): void {
    if (this.verificationForm.invalid) return;
    const email = this.email();
    const code = this.verificationForm.get('code')?.value;
    if (!email || !code) return;

    this.isVerifying.set(true);
    this.verificationError.set(null);

    this.authService.verifyEmail(email, code).subscribe({
      next: () => {
        this.isVerifying.set(false);
        this.router.navigate(['/verify-email']);
      },
      error: (error) => {
        console.error('Error verifying email:', error);
        this.verificationError.set(error.message || $localize `:@@AUTH_EMAIL_CONFIRMATION_FAILED_TO_VERIFY_EMAIL:Failed to verify email`);
        this.isVerifying.set(false);
      }
    });
  }

  resendConfirmation(): void {
    const emailValue = this.email();
    if (!emailValue) {
      this.resendError.set($localize `:@@AUTH_EMAIL_CONFIRMATION_NO_EMAIL_AVAILABLE_FOR_RESENDING_CONFIRMATION:No email available for resending confirmation`);
      return;
    }
    
    this.isResending.set(true);
    this.resendError.set(null);
    
    this.authService.resendConfirmationEmail(emailValue).subscribe({
      next: () => this.isResending.set(false),
      error: (error) => {
        this.resendError.set(error.message || $localize `:@@AUTH_EMAIL_CONFIRMATION_FAILED_TO_SEND_CONFIRMATION_EMAIL:Failed to send confirmation email`);
        this.isResending.set(false);
      }
    });
  }
} 