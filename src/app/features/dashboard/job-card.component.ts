import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Job } from '../../shared/models/job.model';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-50 dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-3 gap-4">
        <!-- Left Column -->
        <div class="flex flex-col gap-2">
          <!-- First Line: Logo and Repository Name -->
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ job().namespace }}/{{ job().repository }}</span>
          </div>
          <!-- Second Line: Request Info and Branch -->
          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            @if (job().request === 'estimation') {
              <span i18n="@@JOB_REQUEST_ESTIMATION">Estimation</span>
            } @else if (job().request === 'translation') {
              <span i18n="@@JOB_REQUEST_TRANSLATION">Translation</span>
            }
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
            <span>{{ job().branch }}</span>
            <span class="text-gray-500 dark:text-gray-500">({{ job().ext }})</span>
          </div>
        </div>

        <!-- Center Column: Translation Units -->
        <div class="flex flex-col items-center justify-center text-center gap-1">
          @if (job().request === 'estimation') {
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              <span i18n="@@ESTIMATION_UNITS">{{ job().transUnitFound }} translation units</span>
            </div>
          } @else {
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              @if (job().transUnitFailed) {
                <span><span class="text-green-500 dark:text-green-400">{{ job().transUnitDone }}</span>/{{ job().transUnitFound }} (<span class="text-red-500 dark:text-red-400">{{ job().transUnitFailed }}</span>)&nbsp;<span i18n="@@TRANSLATION_UNITS">translation units</span></span>
              } @else {
                <span><span class="text-green-500 dark:text-green-400">{{ job().transUnitDone }}</span>/{{ job().transUnitFound }}</span>&nbsp;<span i18n="@@TRANSLATION_UNITS">translation units</span>
              }
            </div>
          }
          @if (job().duration) {
            <div class="text-xs text-gray-500 dark:text-gray-400" i18n="@@JOB_DURATION">Duration: {{ humanizeDuration(job().duration!) }}</div>
          }
        </div>

        <!-- Right Column: Status and Date -->
        <div class="flex flex-col items-end gap-2">
          @if (job().status === 'completed') {
            <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" i18n="@@JOB_STATUS_COMPLETED">Completed</span>
          } @else if (job().status === 'failed') {
            <span class="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" i18n="@@JOB_STATUS_FAILED">Failed</span>
          } @else if (job().status === 'cancelled') {
            <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" i18n="@@JOB_STATUS_CANCELLED">Cancelled</span>
          }
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ job().createdAt | date:'short' }}
          </p>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobCardComponent {
  job = input.required<Job>();

  humanizeDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }
} 