import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p class="text-lg text-gray-600 dark:text-gray-300" i18n="@@AUTH_CALLBACK_MESSAGE">
          Finalizing authentication...
        </p>
      </div>
    </div>
  `
})
export class AuthCallbackComponent implements OnInit {
  private router = inject(Router);

  async ngOnInit() {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Auth callback error:', error);
      await this.router.navigate(['/']);
    }
  }
}