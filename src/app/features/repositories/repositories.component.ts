import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BalanceService } from '../../core/services/balance.service';
import { JobService } from '../../core/services/job.service';
import { RepositoryCardComponent } from './components/repository-card/repository-card.component';
import { RepositoryService } from '../../core/services/repository.service';

@Component({
  selector: 'app-repositories',
  standalone: true,
  imports: [CommonModule, FormsModule, RepositoryCardComponent],
  templateUrl: './repositories.component.html'
})
export class RepositoriesComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private repoService = inject(RepositoryService);
  private balanceService = inject(BalanceService);
  private subscriptions: Subscription = new Subscription();
  private jobService = inject(JobService);
  protected loading = signal(true);
  protected error = signal<string | null>(null);
  protected searchTerm = signal('');
  protected balance = signal<number>(0);
  protected provider = toSignal(this.route.params, { initialValue: { provider: '' } });
  protected allRepositories = signal<any[]>([]);
  
  protected repositories = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.allRepositories();

    return this.allRepositories().filter(repo => {
      const searchableFields = [
        repo.name,
        repo.description,
        repo.language,
        repo.visibility,
        repo.id?.toString()
      ].filter(Boolean).map(field => field.toLowerCase());

      return searchableFields.some(field => field.includes(term));
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
    this.subscriptions.add(this.route.params.subscribe(params => {
      if (params['provider']) {
        this.allRepositories.set([]);
        this.loadRepositories();
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.jobService.closeChannel();
  }

  protected async loadRepositories() {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const provider = this.provider().provider;
      console.log('Loading repositories for provider:', provider);
      
      const repos = await this.repoService.getRepositories(provider).toPromise();
      console.log('Repositories loaded:', repos?.length || 0);
      
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