import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { JobService } from '../../core/services/job.service';
import { ProviderLogoComponent } from '../../shared/components/provider-logo/provider-logo.component';

interface Job {
  userId: string;
  provider: 'github' | 'gitlab' | 'bitbucket';
  namespace: string;
  repository: string;
  branch: string;
  ext: string;
  transUnitState: string;
  request: 'estimation' | 'translation';
  status: 'completed' | 'failed' | 'cancelled' | 'estimation_pending' | 'estimation_running' | 'translation_pending' | 'translation_running';
  transUnitFound?: number;
  transUnitDone?: number;
  transUnitAllowed?: number;
  transactionId?: string;
  runId?: string;
  details: any;
  createdAt?: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DatePipe,
    TitleCasePipe,
    ProviderLogoComponent
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
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  private auth = inject(AuthService);
  private jobService = inject(JobService);
  user = toSignal(this.auth.user$);

  instructionForm = new FormGroup({
    instructions: new FormControl('', [Validators.required])
  });

  jobs = toSignal(this.jobService.getJobs());

  onSubmit() {
    console.log(this.instructionForm.value);
  }
}