import { Component, output } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dev-toolbar',
  standalone: true,
  template: `
    @if (!this.environment.production) {
      <div class="fixed bottom-4 left-4 z-50">
        <div class="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-2 border border-gray-200 dark:border-gray-700">
          <button (click)="showTestError()" class="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </button>
        </div>
      </div>
    }
  `
})
export class DevToolbarComponent {
  protected environment = environment;
  showError = output<string>();

  showTestError(): void {
    this.showError.emit($localize `:@@DEV_TOOLBAR_TEST_ERROR:This is a test error message`);
  }
} 