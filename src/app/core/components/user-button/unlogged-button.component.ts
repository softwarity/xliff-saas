import { Component, HostListener, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import '../../../web-components/icon';
import '../../../web-components/theme-switcher';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-unlogged-button',
  standalone: true,
  imports: [ReactiveFormsModule],
  styles: [`
    :host {
      position: relative;
    }
  `],
  template: `
  <button  (click)="toggleAuthForm()" class="flat-primary" i18n="@@AUTH_SIGN_IN_BUTTON">Sign In</button>
  @if (showAuthForm()) {
    <div class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-700 rounded-lg shadow-lg p-4 z-50">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" autocomplete="off">
        <div class="space-y-4">
          <div>
            <label for="email" i18n="@@AUTH_EMAIL_LABEL">
              Email
            </label>
            <input id="email" type="email" formControlName="email" i18n-placeholder="@@AUTH_EMAIL_PLACEHOLDER" placeholder="Enter your email" class="w-full"/>
          </div>
          <div>
            <label for="password" i18n="@@AUTH_PASSWORD_LABEL">
              Password
            </label>
            <input id="password" type="password" formControlName="password" i18n-placeholder="@@AUTH_PASSWORD_PLACEHOLDER" placeholder="Enter your password" class="w-full"/>
            @if (isCapsLockOn()) {
              <span class="flex justify-end text-red-500 text-sm" i18n="@@AUTH_CAPS_LOCK_ON">Caps Lock is on</span>
            }
          </div>
          <div>
            <button type="submit" [disabled]="form.invalid" class="w-full flat-primary">
              @if (isRegistering()) {
                <span i18n="@@AUTH_SIGN_UP_BUTTON">Sign Up</span>
              } @else {
                <span i18n="@@AUTH_SIGN_IN_BUTTON">Sign In</span>
              }
            </button>
          </div>
          <div class="text-center">
            <button type="button" (click)="toggleRegister()" class="text-sm text-primary dark:text-blue-400 hover:underline">
              @if (isRegistering()) { 
                <span i18n="@@AUTH_ALREADY_HAVE_ACCOUNT_SIGN_IN_BUTTON">Already have an account? Sign In</span>
              } @else {
                <span i18n="@@AUTH_NO_ACCOUNT_SIGN_UP_BUTTON">No account? Sign Up</span>
              }
            </button>
          </div>
        </div>
      </form>
    </div>
  }
  `
})
export class UnloggedButtonComponent {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  protected showAuthForm = signal(false);
  protected isRegistering = signal(false);
  isCapsLockOn = signal(false);

  protected form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  @HostListener('document:keydown', ['$event'])
  setCapslock(event: KeyboardEvent) {
    if (event.code === 'CapsLock') {
      this.isCapsLockOn.set(!event.getModifierState('CapsLock'));
    } else {
      this.isCapsLockOn.set(event.getModifierState('CapsLock'));
    }
  }
  
  protected toggleAuthForm(): void {
    this.showAuthForm.update(v => !v);
    if (!this.showAuthForm()) {
      this.form.reset();
      this.isRegistering.set(false);
    }
  }

  protected toggleRegister(): void {
    this.isRegistering.update(v => !v);
    this.form.reset();
  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    const { email, password } = this.form.getRawValue();
    if (!email || !password) return;

    try {
      const success = this.isRegistering() 
        ? await this.auth.signUp(email, password)
        : await this.auth.signIn(email, password);

      if (success) {
        console.log('Authentification réussie');
        this.form.reset();
        this.showAuthForm.set(false);
        this.isRegistering.set(false);
      } else {
        console.log('Échec de l\'authentification');
      }
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
    }
  }
}