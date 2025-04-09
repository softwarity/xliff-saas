import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { JobService } from '../../core/services/job.service';
import { Job } from '../../shared/models/job.model';
import { JobCardComponent } from './job-card.component';

interface PaginatedJobs {
  data: Job[];
  count: number;
  error: any;
}

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
    textarea {
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
  totalJobs = signal<number>(0);
  currentPage = signal<number>(1);
  totalPages = computed(() => Math.ceil(this.totalJobs() / this.pageSize));
  pageSize = 10;
  instructionForm: FormGroup;
  protected Math = Math;
  isRefreshing = false;

  constructor() {
    this.instructionForm = this.fb.group({
      instructions: ['', Validators.required]
    });

    this.loadJobs();
  }

  loadJobs() {
    this.isRefreshing = true;
    this.jobService.getJobs(['completed', 'failed', 'cancelled'], this.currentPage(), this.pageSize).subscribe({
      next: (response: PaginatedJobs) => {
        this.jobs.set(response.data);
        this.totalJobs.set(response.count);
        this.isRefreshing = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.isRefreshing = false;
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadJobs();
  }

  onSubmit() {
    if (this.instructionForm.valid) {
      console.log('AI Instructions:', this.instructionForm.value);
    }
  }
}