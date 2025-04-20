import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { BitbucketService } from './bitbucket.service';
import { Repository } from '../../../shared/models/repository.model';
import { RepositoryCardComponent } from '../components/repository-card/repository-card.component';
import { RepositoriesComponent } from '../repositories.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RepositoryCardComponent],
  providers: [BitbucketService],
  templateUrl: '../repositories.component.html'
})
export class BitbucketRepositoriesComponent extends RepositoriesComponent {
  private bitbucketService = inject(BitbucketService);

  getProvider(): string {
    return 'bitbucket';
  }

  getRepositories(): Observable<Repository[]> {
    return this.bitbucketService.getRepositories();
  }
}