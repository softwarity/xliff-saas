import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { JobService } from '../../core/services/job.service';
import { Job } from '../../shared/models/job.model';
import { JobCardComponent } from './job-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    JobCardComponent
  ],
  styles: [
    `
    label {
      @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
    }
    textarea {
      @apply w-full border rounded-lg px-4 py-2;
      @apply bg-white border border-gray-300;
      @apply disabled:opacity-50 disabled:cursor-not-allowed;
      @apply focus:outline-none focus:ring-2 focus:ring-primary;
      @apply dark:bg-dark-800 dark:border-gray-600 dark:text-white;
      min-height: 150px;
    }
    `
  ],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private auth = inject(AuthService);
  private jobService = inject(JobService);
  private fb = inject(FormBuilder);
  user = toSignal(this.auth.user$);

  jobs = signal<Job[]>([]);
  instructionForm: FormGroup;

  constructor() {
    this.instructionForm = this.fb.group({
      instructions: ['', Validators.required]
    });

    this.jobService.getJobs(['completed', 'failed', 'cancelled']).subscribe((jobs: Job[]) => {
      this.jobs.set(jobs);
    });
  }

  onSubmit() {
    if (this.instructionForm.valid) {
      console.log('AI Instructions:', this.instructionForm.value);
    }
  }
}