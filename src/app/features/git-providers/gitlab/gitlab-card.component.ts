import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GitlabService, GitProvider } from './gitlab.service';

@Component({
  selector: 'app-gitlab-card',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [GitlabService],
  template: `<div class="bg-white dark:bg-dark-700 rounded-lg shadow p-6">
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center space-x-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.955 13.587l-1.342-4.135-2.664-8.189a.455.455 0 00-.867 0L16.418 9.45H7.582L4.918 1.263a.455.455 0 00-.867 0L1.386 9.45.044 13.587a.924.924 0 00.331 1.03L12 23.054l11.625-8.436a.92.92 0 00.33-1.031"/>
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
export class GitlabCardComponent {
  provider = input.required<GitProvider>();

  private gitlabService = inject(GitlabService);
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
    
    this.gitlabService.validateAndStoreToken(this.provider(), token).subscribe({
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
    
    this.gitlabService.disconnectProvider(this.provider().type);
    
    setTimeout(() => {
      this.loading.set(false);
      this.form.reset();
    }, 500);
  }
}