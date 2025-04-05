import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { GitlabService } from '../../core/services/gitlab.service';
import { Repository } from '../../shared/models/repository.model';
import { RepositoryCardComponent } from './components/repository-card/repository-card.component';
import { RepositoriesComponent } from './repositories.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RepositoryCardComponent],
  templateUrl: './repositories.component.html'
})
export class GitlabRepositoriesComponent extends RepositoriesComponent {
  private gitlabService = inject(GitlabService);

  getProvider(): string {
    return 'gitlab';
  }

  getRepositories(): Observable<Repository[]> {
    return this.gitlabService.getRepositories();
  }
}