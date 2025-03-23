import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ProviderType } from '../../../shared/models/provider-type';

@Component({
  selector: 'app-provider-icon',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
      <div class="flex-shrink-0 flex items-center self-start h-12">
      @switch (provider()) {
        @case ('github') {
          <svg class="h-6 w-6" [class]="visibility()" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        }
        @case ('gitlab') {
          <svg class="h-6 w-6" [class]="visibility()" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"/>
          </svg>
        }
        @default {
          <svg class="h-6 w-6" [class]="visibility()" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 01.708 0l2 2a.5.5 0 01-.708.708L8.5 6.707V10.5a.5.5 0 01-1 0V6.707L6.354 7.854a.5.5 0 11-.708-.708l2-2z" clip-rule="evenodd"/>
            <path d="M6 3a1 1 0 011-1h6a1 1 0 011 1v4a1 1 0 01-1 1H7a1 1 0 01-1-1V3zm1 0v4h6V3H7z"/>
          </svg>
        }
      }
    </div>
  `,
  styles: [`
    svg {
      @apply text-gray-700 dark:text-gray-300;
    }
    svg.private {
      @apply text-red-700 dark:text-red-300;
    }
  `]
})
export class ProviderIconComponent {
  provider = input.required<ProviderType>();
  visibility = input.required<string>();


}