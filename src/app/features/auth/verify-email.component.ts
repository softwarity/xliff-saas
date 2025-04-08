import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, from, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrl: './auth.component.css',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="text-center mb-6">
          @if (isLoading) {
            <svg class="animate-spin mx-auto h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h1 class="text-2xl font-bold mb-2" i18n="@@AUTH_VERIFY_EMAIL_LOADING_TITLE">Verification in progress...</h1>
            <p class="text-gray-600 dark:text-gray-400" i18n="@@AUTH_VERIFY_EMAIL_LOADING_SUBTITLE">Please wait while we verify your email</p>
          }
          @else if (error) {
            <svg class="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 class="text-2xl font-bold mb-2" i18n="@@AUTH_VERIFY_EMAIL_ERROR_TITLE">Verification Error</h1>
            <p class="text-gray-600 dark:text-gray-400" i18n="@@AUTH_VERIFY_EMAIL_ERROR_SUBTITLE">{{ error }}</p>
          }
          @else {
            <svg class="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <h1 class="text-2xl font-bold mb-2" i18n="@@AUTH_VERIFY_EMAIL_SUCCESS_TITLE">Email successfully verified!</h1>
            <p class="text-gray-600 dark:text-gray-400" i18n="@@AUTH_VERIFY_EMAIL_SUCCESS_SUBTITLE">Your email has been verified. You can now use all features of the application.</p>
          }
        </div>

        <div class="auth-footer">
          @if (error || !isLoading) {
            <a routerLink="/auth/login" class="flat-primary w-full block text-center" i18n="@@AUTH_VERIFY_EMAIL_RETURN_LOGIN">Go to login page</a>
          }
        </div>
      </div>
    </div>
  `
})
export class VerifyEmailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const type = params['type'];
      
      if (!token || type !== 'signup') {
        this.isLoading = false;
        this.error = $localize `:@@AUTH_VERIFY_EMAIL_INVALID_LINK:Invalid or expired verification link.`;
        return;
      }
      
      this.authService.verifyEmail(token).subscribe({
        next: () => this.isLoading = false,
        error: (err) => {
          this.isLoading = false;
          this.error = err.message || $localize `:@@AUTH_VERIFY_EMAIL_GENERIC_ERROR:An error occurred while verifying your email.`;
        }
      });
    });
  }
} 