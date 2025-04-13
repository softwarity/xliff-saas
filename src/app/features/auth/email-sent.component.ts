import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="bg-light-surface dark:bg-dark-800 border border-light-border dark:border-dark-600 rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 class="text-2xl font-bold text-center mb-6" i18n="@@AUTH_EMAIL_SENT_TITLE">Email Sent</h1>
        
        <div class="space-y-4">
          <p class="text-gray-600 dark:text-gray-400" i18n="@@AUTH_EMAIL_SENT_MESSAGE">
            We've sent you an email with instructions. Please check your inbox and follow the instructions provided.
          </p>
          
          <div class="text-center">
            <a routerLink="/auth/login" class="text-primary hover:text-primary-hover font-medium" i18n="@@AUTH_EMAIL_SENT_BACK_TO_LOGIN">Back to Login</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmailSentComponent {} 