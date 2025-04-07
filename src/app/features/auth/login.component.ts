import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { from, tap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styleUrl: './auth.component.css',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="text-2xl font-bold text-center mb-6" i18n="@@AUTH_LOGIN_TITLE">Sign In</h1>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email" i18n="@@AUTH_LOGIN_EMAIL">Email</label>
            <input type="email" id="email" formControlName="email" [class.error]="email.invalid && email.touched" autocomplete="email"/>
            @if (email.invalid && email.touched) {
              <div class="error-message">
                @if (email.errors?.['required']) {
                  <span i18n="@@AUTH_LOGIN_EMAIL_REQUIRED">Email is required</span>
                }
                @if (email.errors?.['email']) {
                  <span i18n="@@AUTH_LOGIN_EMAIL_INVALID">Please enter a valid email</span>
                }
              </div>
            }
          </div>

          <div class="form-group">
            <label for="password" i18n="@@AUTH_LOGIN_PASSWORD">Password</label>
            <input type="password" id="password" formControlName="password" [class.error]="password.invalid && password.touched" autocomplete="current-password"/>
            @if (password.invalid && password.touched) {
              <div class="error-message">
                @if (password.errors?.['required']) {
                  <span i18n="@@AUTH_LOGIN_PASSWORD_REQUIRED">Password is required</span>
                }
              </div>
            }
          </div>

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

        <div class="auth-footer">
          <span i18n="@@AUTH_LOGIN_NO_ACCOUNT">Don't have an account?</span>
          <a routerLink="/auth/signup" i18n="@@AUTH_LOGIN_SIGN_UP">Sign Up</a>
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
  error = signal<string | null>(null);

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

    const login$ = from(this.authService.signInWithEmail(
      this.email.value,
      this.password.value
    )).pipe(
      tap({
        next: () => this.router.navigate(['/']),
        error: (err) => {
          this.error.set(err.message);
          this.isLoading.set(false);
        }
      })
    );

    login$.subscribe();
  }

  signInWithGoogle(): void {
    this.isLoading.set(true);
    this.error.set(null);

    const googleSignIn$ = from(this.authService.signInWithGoogle()).pipe(
      tap({
        next: () => this.router.navigate(['/']),
        error: (err) => {
          this.error.set(err.message);
          this.isLoading.set(false);
        }
      })
    );

    googleSignIn$.subscribe();
  }
}