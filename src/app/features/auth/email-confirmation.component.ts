import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-email-confirmation',
  standalone: true,
  imports: [RouterLink],
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

  isResending = signal(false);
  email = signal<string | null>(null);
  resendError = signal<string | null>(null);

  ngOnInit(): void {
    const storedEmail = localStorage.getItem('pendingConfirmationEmail');
    this.email.set(storedEmail);
  }

  resendConfirmation(): void {
    console.log('Attempting to resend confirmation email');
    this.resendError.set(null);
    
    const emailValue = this.email();
    if (!emailValue) {
      this.resendError.set('No email available for resending confirmation');
      return;
    }
    
    this.isResending.set(true);
    this.authService.resendConfirmationEmail(emailValue).subscribe({
      next: () => {
        console.log('Email resent successfully');
        this.isResending.set(false);
      },
      error: (error) => {
        console.error('Error resending confirmation email:', error);
        this.resendError.set(error.message || 'Failed to send confirmation email');
        this.isResending.set(false);
      }
    });
  }
} 