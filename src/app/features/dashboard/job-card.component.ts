import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProviderLogoComponent } from '../../shared/components/provider-logo/provider-logo.component';
import { Job } from '../../shared/models/job.model';
import '../../web-components/icon';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule, ProviderLogoComponent],
  template: `
    <div class="bg-gray-50 dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-3 gap-4">
        <!-- Left Column -->
        <div class="flex flex-col gap-2">
          <!-- First Line: Logo and Repository Name -->
          <div class="flex items-center gap-2">
            <app-provider-logo [provider]="job().provider" class="w-5 h-5 text-gray-700 dark:text-gray-300"/>
            <span class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ job().namespace }}/{{ job().repository }}
            </span>
          </div>
          <!-- Second Line: Request Info and Branch -->
          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>{{ job().request | titlecase }}</span>
            <app-icon name="branch" [size]="10" [color]="'blue'"></app-icon>
            <span>{{ job().branch }}</span>
            <span class="text-gray-500 dark:text-gray-500">({{ job().ext }})</span>
          </div>
        </div>

        <!-- Center Column: Translation Units -->
        <div class="flex items-center justify-center text-center">
          @if (job().request === 'estimation') {
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ job().transUnitFound }} translation units
            </div>
          } @else {
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ job().transUnitDone }}/{{ job().transUnitFound }} translation units
              @if (job().transUnitFailed) {
                <span class="text-red-500 dark:text-red-400"> ({{ job().transUnitFailed }} failed)</span>
              }
            </div>
          }
        </div>

        <!-- Right Column: Status and Date -->
        <div class="flex flex-col items-end gap-2">
          @if (job().status === 'completed') {
            <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {{ job().status | titlecase }}
            </span>
          } @else if (job().status === 'failed') {
            <span class="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              {{ job().status | titlecase }}  
            </span>
          } @else if (job().status === 'cancelled') {
            <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
              {{ job().status | titlecase }}
            </span>
          }
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ job().createdAt | date:'short' }}
          </p>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JobCardComponent {
  job = input.required<Job>();
} 