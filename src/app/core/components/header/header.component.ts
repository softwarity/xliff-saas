import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProviderLogoComponent } from '../../../shared/components/provider-logo/provider-logo.component';
import { AuthService } from '../../services/auth.service';
import { GitProviderService } from '../../services/git-provider.service';
import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';
import '../../../web-components/theme-switcher';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    LanguageToggleComponent,
    ReactiveFormsModule,
    CommonModule,
    ProviderLogoComponent
  ],
  templateUrl: './header.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderComponent {
  private auth = inject(AuthService);
  private gitProviderService = inject(GitProviderService);
  private fb = inject(FormBuilder);

  protected showAuthForm = signal(false);
  protected isRegistering = signal(false);
  protected showUserMenu = signal(false);
  randomId = signal(Math.random().toString(36).substring(2, 15));

  protected isAuthenticated = toSignal(this.auth.isAuthenticated$, { initialValue: false });
  protected user = toSignal(this.auth.user$);
  protected providers = toSignal(this.gitProviderService.providers$, { initialValue: [] });

  protected form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

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

  protected toggleUserMenu(): void {
    this.showUserMenu.update(v => !v);
  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    const { email, password } = this.form.getRawValue();
    if (!email || !password) return;

    try {
      console.log('Soumission du formulaire:', this.isRegistering() ? 'Inscription' : 'Connexion');
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

  protected async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
      this.showUserMenu.set(false);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  }

  protected getConnectedProviders() {
    return this.providers().filter(p => p.connected);
  }
}