import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { GithubService } from './github.service';
import { Repository } from '../../../shared/models/repository.model';
import { RepositoryCardComponent } from '../components/repository-card/repository-card.component';
import { RepositoriesComponent } from '../repositories.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RepositoryCardComponent],
  providers: [GithubService],
  templateUrl: '../repositories.component.html'
})
export class GithubRepositoriesComponent extends RepositoriesComponent {
  private githubService = inject(GithubService);

  getProvider(): string {
    return 'github';
  }

  getRepositories(): Observable<Repository[]> {
    return this.githubService.getRepositories();
  }
}