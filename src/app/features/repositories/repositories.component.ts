import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { BalanceService } from '../../core/services/balance.service';
import { JobService } from '../../core/services/job.service';
import { Repository } from '../../shared/models/repository.model';

@Component({
  standalone: true,
  template: ``
})
export abstract class RepositoriesComponent implements OnInit, OnDestroy {
  private balanceService = inject(BalanceService);
  private subscriptions: Subscription = new Subscription();
  private jobService = inject(JobService);
  protected loading = signal(true);
  protected error = signal<string | null>(null);
  protected searchTerm = signal('');
  protected balance = signal<number>(0);
  protected allRepositories = signal<Repository[]>([]);
  
  protected repositories = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.allRepositories();

    return this.allRepositories().filter(repo => {
      const searchableFields = [
        repo.namespace,
        repo.name,
        repo.description,
        repo.language,
        repo.visibility
      ].filter(Boolean).map(field => field?.toLowerCase());

      return searchableFields.some(field => field?.includes(term));
    });
  });

  constructor() {
    this.subscriptions.add(this.balanceService.subscribeToBalanceChanges().subscribe({
      next: (balance: number) => {
        this.balance.set(balance);
      },
      error: (error) => {
        this.balance.set(0);
        console.error('Error subscribing to credit changes:', error);
      }
    }));
  }

  ngOnInit() {
    this.allRepositories.set([]);
    this.loadRepositories();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.jobService.closeChannel();
  }

  abstract getRepositories(): Observable<Repository[]>;
  abstract getProvider(): string;

  protected async loadRepositories() {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const repos = await firstValueFrom(this.getRepositories());
      if (repos && repos.length > 0) {
        this.allRepositories.set(repos);
        this.searchTerm.set('');
      } else {
        this.error.set($localize`:@@NO_REPOSITORIES_FOUND_PLEASE_CHECK:No repositories found. Please check your token permissions.`);
      }
    } catch (err) {
      console.error('Error loading repositories:', err);
      this.error.set($localize`:@@FAILED_TO_LOAD_REPOSITORIES:Failed to load repositories. Please check your token permissions and try again.`);
    } finally {
      this.loading.set(false);
    }
  }

  protected updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }
}