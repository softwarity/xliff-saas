import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { Job } from '../../shared/models/job.model';
import '../../web-components/icon';

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
            <app-icon name="github" size="24" fill="currentColor"/>
            <span class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ job().namespace }}/{{ job().repository }}
            </span>
          </div>
          <!-- Second Line: Request Info and Branch -->
          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <app-icon name="task" size="24" stroke="currentColor" fill="none"></app-icon>
            @if (job().request === 'estimation') {
              <span i18n="@@JOB_REQUEST_ESTIMATION">Estimation</span>
            } @else if (job().request === 'translation') {
              <span i18n="@@JOB_REQUEST_TRANSLATION">Translation</span>
            }
            <app-icon name="branch" size="24" fill="currentColor" stroke="none"></app-icon>
            <span i18n="@@JOB_BRANCH">{{ job().branch }}</span>
            <span class="text-gray-500 dark:text-gray-500" i18n="@@JOB_EXT">({{ job().ext }})</span>
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
            <div class="text-xs text-gray-500 dark:text-gray-400" i18n="@@JOB_DURATION">
              Duration: {{ humanizeDuration(job().duration!) }}
            </div>
          }
        </div>

        <!-- Right Column: Status and Date -->
        <div class="flex flex-col items-end gap-2">
          @if (job().status === 'completed') {
            <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" i18n="@@JOB_STATUS_COMPLETED">
              Completed
            </span>
          } @else if (job().status === 'failed') {
            <span class="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" i18n="@@JOB_STATUS_FAILED">
              Failed
            </span>
          } @else if (job().status === 'cancelled') {
            <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" i18n="@@JOB_STATUS_CANCELLED">
              Cancelled
            </span>
          }
          <p class="text-xs text-gray-500 dark:text-gray-400" i18n="@@JOB_CREATED_AT">
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