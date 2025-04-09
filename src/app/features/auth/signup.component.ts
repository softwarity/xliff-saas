import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { from } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styleUrl: './auth.component.css',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="text-2xl font-bold text-center mb-6" i18n="@@AUTH_SIGNUP_TITLE">Sign Up</h1>
        
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email" i18n="@@AUTH_SIGNUP_EMAIL">Email</label>
            <input type="email" id="email" formControlName="email" [class.error]="email.invalid && email.touched" autocomplete="email"/>
            @if (email.invalid && email.touched) {
              <div class="error-message">
                @if (email.errors?.['required']) {
                  <span i18n="@@AUTH_SIGNUP_EMAIL_REQUIRED">Email is required</span>
                }
                @if (email.errors?.['email']) {
                  <span i18n="@@AUTH_SIGNUP_EMAIL_INVALID">Please enter a valid email</span>
                }
              </div>
            }
          </div>

          <div class="form-group">
            <label for="password" i18n="@@AUTH_SIGNUP_PASSWORD">Password</label>
            <input type="password" id="password" formControlName="password" [class.error]="password.invalid && password.touched"autocomplete="new-password"/>
            @if (password.invalid && password.touched) {
              <div class="error-message">
                @if (password.errors?.['required']) {
                  <span i18n="@@AUTH_SIGNUP_PASSWORD_REQUIRED">Password is required</span>
                }
                @if (password.errors?.['minlength']) {
                  <span i18n="@@AUTH_SIGNUP_PASSWORD_MIN_LENGTH">Password must be at least 6 characters</span>
                }
              </div>
            }
          </div>

          <div class="form-group">
            <label for="confirmPassword" i18n="@@AUTH_SIGNUP_CONFIRM_PASSWORD">Confirm Password</label>
            <input type="password" id="confirmPassword" formControlName="confirmPassword" [class.error]="confirmPassword.invalid && confirmPassword.touched"autocomplete="new-password"/>
            @if (confirmPassword.invalid && confirmPassword.touched) {
              <div class="error-message">
                @if (confirmPassword.errors?.['required']) {
                  <span i18n="@@AUTH_SIGNUP_CONFIRM_PASSWORD_REQUIRED">Please confirm your password</span>
                }
                @if (confirmPassword.errors?.['passwordMismatch']) {
                  <span i18n="@@AUTH_SIGNUP_PASSWORDS_DONT_MATCH">Passwords don't match</span>
                }
              </div>
            }
          </div>

          @if (error()) {
            <div class="error-message mb-4">
              <span>{{ error() }}</span>
            </div>
          }

          <button type="submit" [disabled]="signupForm.invalid || isLoading()" class="flat-primary w-full">
            @if (!isLoading()) {
              <span i18n="@@AUTH_SIGNUP_CREATE_ACCOUNT">Create Account</span>
            } @else {
              <span i18n="@@AUTH_SIGNUP_CREATING_ACCOUNT">Creating account...</span>
            }
          </button>
        </form>

        <div class="separator">
          <span i18n="@@AUTH_SIGNUP_OR">or</span>
        </div>

        <div class="auth-footer">
          <span i18n="@@AUTH_SIGNUP_HAVE_ACCOUNT">Already have an account?</span>
          <a routerLink="/auth/login" i18n="@@AUTH_SIGNUP_SIGN_IN">Sign In</a>
        </div>
      </div>
    </div>
  `
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  error = signal<string | null>(null);

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  get email() { return this.signupForm.get('email') as FormControl; }
  get password() { return this.signupForm.get('password') as FormControl; }
  get confirmPassword() { return this.signupForm.get('confirmPassword') as FormControl; }

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.signupForm.invalid) return;
    this.isLoading.set(true);
    this.error.set(null);
    
    const email = this.email.value;
    const password = this.password.value;
    
    console.log('Attempting to sign up with email:', email);
    localStorage.setItem('pendingConfirmationEmail', email);
    
    from(this.authService.signUp(
      email,
      password
    )).subscribe({
      next: () => {
        console.log('Signup successful, redirecting to email confirmation');
        this.authService.signOut().subscribe({
          next: () => {
            this.router.navigate(['/auth/email-confirmation']);
          },
          error: (err) => {
            console.error('Error signing out after signup:', err);
            // Even if signout fails, redirect to confirmation page
            this.router.navigate(['/auth/email-confirmation']);
          }
        });
      },
      error: (err) => {
        console.error('Signup error in component:', err);
        // Use i18n for all error messages
        let errorMessage: string;
        
        // User-friendly error messages
        if (err.message.includes('User already registered')) {
          errorMessage = $localize `:@@AUTH_SIGNUP_USER_EXISTS:This email is already in use`;
        } else if (err.message.includes('invalid credentials')) {
          errorMessage = $localize `:@@AUTH_SIGNUP_INVALID_CREDENTIALS:Invalid credentials`;
        } else if (err.message.includes('password')) {
          errorMessage = $localize `:@@AUTH_SIGNUP_PASSWORD_REQUIREMENTS:Password does not meet security requirements`;
        } else {
          errorMessage = $localize `:@@AUTH_SIGNUP_GENERAL_ERROR:Error creating account: ${err.message}`;
        }
        
        this.error.set(errorMessage);
        this.isLoading.set(false);
      }
    });
  }
}