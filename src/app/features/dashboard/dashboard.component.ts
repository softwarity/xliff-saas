import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { JobService } from '../../core/services/job.service';
import { BalanceService } from '../../core/services/balance.service';
import { Job } from '../../shared/models/job.model';
import { JobCardComponent } from './job-card.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    JobCardComponent
  ],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private auth = inject(AuthService);
  private jobService = inject(JobService);
  private balanceService = inject(BalanceService);
  
  user = toSignal(this.auth.user$);
  credits = toSignal(this.balanceService.balance$);
  
  jobs = signal<Job[]>([]);
  totalJobs = signal<number>(0);
  currentPage = signal<number>(1);
  totalPages = computed(() => Math.ceil(this.totalJobs() / this.pageSize));
  pageSize = 10;
  protected Math = Math;
  isRefreshing = false;
  
  // Active jobs
  activeJobs = signal<Job[]>([]);
  
  // Translations this month
  translationsThisMonth = signal<number>(0);
  
  // User membership level
  membershipLevel = signal<string>('BRONZE');

  constructor() {
    effect(() => {
      this.loadJobs();
    });
    this.loadActiveJobs();
    this.loadTranslationsThisMonth();
    this.loadUserMembershipLevel();
  }

  loadJobs() {
    this.isRefreshing = true;
    this.jobService.getJobs(['completed', 'failed', 'cancelled'], this.currentPage(), this.pageSize).subscribe({
      next: (response: Paginated<Job>) => {
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
  
  loadActiveJobs() {
    this.jobService.getJobs(['pending', 'processing']).subscribe({
      next: (response: Paginated<Job>) => {
        this.activeJobs.set(response.data);
      },
      error: (error) => {
        console.error('Error loading active jobs:', error);
      }
    });
  }
  
  loadTranslationsThisMonth() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Get all completed jobs from this month
    this.jobService.getJobs(['completed'], 1, 100).pipe(
      map(response => {
        // Filter jobs from this month and count translation units
        const thisMonthJobs = response.data.filter(job => {
          const jobDate = new Date(job.createdAt || '');
          return jobDate >= firstDayOfMonth;
        });
        
        // Calculate total translation units
        let totalUnits = 0;
        thisMonthJobs.forEach(job => {
          if (job.transUnitDone) {
            totalUnits += job.transUnitDone;
          }
        });
        
        return totalUnits;
      })
    ).subscribe({
      next: (totalUnits: number) => {
        this.translationsThisMonth.set(totalUnits);
      },
      error: (error) => {
        console.error('Error calculating translations this month:', error);
      }
    });
  }
  
  loadUserMembershipLevel() {
    this.auth.getUser().subscribe({
      next: (userData) => {
        if (userData && userData.app_metadata && userData.app_metadata['membershipLevel']) {
          this.membershipLevel.set(userData.app_metadata['membershipLevel']);
        } else {
          this.membershipLevel.set('BRONZE');
        }
      },
      error: (error) => {
        console.error('Error loading user membership level:', error);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadJobs();
  }
  
  cancelJob(jobId: string) {
    this.jobService.cancelJob(jobId).subscribe({
      next: () => {
        // Refresh active jobs after successful cancellation
        this.loadActiveJobs();
      },
      error: (error) => {
        console.error('Error cancelling job:', error);
      }
    });
  }
}