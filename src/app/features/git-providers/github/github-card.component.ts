import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GithubService, GitProvider } from './github.service';

@Component({
  selector: 'app-github-card',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [GithubService],
  template: `<div class="bg-white dark:bg-dark-700 rounded-lg shadow p-6">
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center space-x-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
      <h2 class="text-xl font-semibold dark:text-white">{{ provider().name }}</h2>
    </div>
    <span [class]="provider().connected ? 'text-green-500' : 'text-red-500'">
      @if (provider().connected) {
        <span i18n="@@PROVIDER_CONNECTED">Connected</span>
      } @else {
        <span i18n="@@PROVIDER_NOT_CONNECTED">Not Connected</span>
      }
    </span>
  </div>

  @if (!provider().connected) {
    <div>
      <p class="text-gray-600 dark:text-gray-300 mb-4" i18n="@@TOKEN_SCOPES_INTRO">To connect, generate a Personal Access Token with the following scopes:</p>
      <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 mb-4">
        @for (scope of provider().scopes; track scope) {
          <li>{{ scope }}</li>
        }
      </ul>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span i18n="@@GET_TOKEN_HERE">Get your token here:</span> {{ provider().tokenHint }}
      </p>
    </div>
  }

  <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
    @if (!provider().connected || showTokenInput()) {
      @if (provider().type === 'bitbucket') {
        <div class="space-y-3">
          <div class="form-group">
            <label>Username</label>
            <input type="text" formControlName="username" i18n-placeholder="@@USERNAME_PLACEHOLDER" placeholder="Enter your Bitbucket username" class="w-full" [class.border-red-500]="error()"
            />
          </div>
          <div class="form-group">
            <label>App Password</label>
            <input type="text" formControlName="appPassword" i18n-placeholder="@@APP_PASSWORD_PLACEHOLDER" placeholder="Enter your app password" class="w-full" [class.border-red-500]="error()"
            />
          </div>
        </div>
      } @else {
        <div class="form-group">
          <label>Token</label>
          <input type="text" formControlName="token" i18n-placeholder="@@TOKEN_INPUT_PLACEHOLDER" placeholder="Enter your access token" class="w-full" [class.border-red-500]="error()"/>
        </div>
      }

      @if (error()) {
        <div class="error-messages mt-2">
          <p class="text-red-500 text-sm">{{ error() }}</p>
        </div>
      }
    }

    <div class="flex space-x-2">
      @if (!provider().connected) {
        <button type="submit" class="flex-1 flat-primary" [disabled]="!isFormValid() || loading()">
          @if (loading()) {
            <span class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span i18n="@@CONNECTING">Connecting...</span>
            </span>
          } @else {
            <span i18n="@@CONNECT_BUTTON">Connect</span>
          }
        </button>
      }
      
      @if (provider().connected) {
        <button type="button" (click)="updateShowTokenInput(true)" class="flex-1 flat-primary" [hidden]="showTokenInput()" i18n="@@UPDATE_TOKEN_BUTTON">Update Token</button>
        <button type="button" (click)="disconnectProvider()" class="flex-1 flat-warning" [disabled]="loading()">
          @if (loading()) {
            <span class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span i18n="@@DISCONNECTING">Disconnecting...</span>
            </span>
          } @else {
            <span i18n="@@DISCONNECT_BUTTON">Disconnect</span>
          }
        </button>
      }
    </div>
  </form>
</div>
`
})
export class GithubCardComponent {
  provider = input.required<GitProvider>();

  private githubService = inject(GithubService);
  private fb = inject(FormBuilder);

  protected showTokenInput = signal<boolean>(false);
  protected loading = signal<boolean>(false);
  protected error = signal<string | null>(null);

  protected form = this.fb.nonNullable.group({
    token: ['', [Validators.required]],
  });

  protected isFormValid(): boolean {
    return !!this.form.controls.token.value;
  }

  protected onSubmit(): void {
    if (!this.isFormValid()) return;

    const token: string = this.form.controls.token.value;

    this.loading.set(true);
    this.error.set(null);
    
    this.githubService.validateAndStoreToken(this.provider(), token).subscribe({
      next: () => {
        this.form.reset();
        this.updateShowTokenInput(false);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to validate credentials.'+err.message);
        this.loading.set(false);
      }
    });
  }

  protected updateShowTokenInput(value: boolean): void {
    this.showTokenInput.set(value);
    if (!value) {
      this.form.reset();
      this.error.set(null);
    }
  }

  protected disconnectProvider(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.githubService.disconnectProvider(this.provider().type);
    
    setTimeout(() => {
      this.loading.set(false);
      this.form.reset();
    }, 500);
  }
}