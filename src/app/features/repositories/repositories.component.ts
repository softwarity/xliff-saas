import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RepositoryService } from './services/repository.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { RepositoryCardComponent } from './components/repository-card/repository-card.component';
import { JobService } from './services/job.service';

@Component({
  selector: 'app-repositories',
  standalone: true,
  imports: [CommonModule, FormsModule, RepositoryCardComponent],
  templateUrl: './repositories.component.html'
})
export class RepositoriesComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private repoService = inject(RepositoryService);
  private routeSubscription?: Subscription;
  private jobService = inject(JobService);
  protected loading = signal(true);
  protected error = signal<string | null>(null);
  protected searchTerm = signal('');
  
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

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      if (params['provider']) {
        this.allRepositories.set([]);
        this.loadRepositories();
      }
    });
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
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
        this.error.set('No repositories found. Please check your token permissions.');
      }
    } catch (err) {
      console.error('Error loading repositories:', err);
      this.error.set('Failed to load repositories. Please check your token permissions and try again.');
    } finally {
      this.loading.set(false);
    }
  }

  protected updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }
}