import { Injectable, inject } from '@angular/core';
import { Observable, from, map, switchMap } from 'rxjs';
import { GitProviderService } from '../../../core/services/git-provider.service';
import { ProviderType } from '../../../shared/models/provider-type';

export interface GitProvider {
  name: string;
  type: ProviderType;
  connected: boolean;
  tokenHint?: string;
  scopes: string[];
}

@Injectable()
export class GitlabService {
  private gitProviderService = inject(GitProviderService);

  validateAndStoreToken(provider: GitProvider, token: string): Observable<void> {
    return this.testGitlabToken(provider, token).pipe(
      switchMap(() => this.gitProviderService.storeTokenValidated(provider, token))
    );
  }

  private testGitlabToken(provider: GitProvider, token: string): Observable<void> {
    const gitlab = {
      url: 'https://gitlab.com/api/v4/user',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
       }
    };
    return from(fetch(gitlab.url, { headers: gitlab.headers})).pipe(
      map((response: Response) => {
        if (response.ok) {
          return void 0;
        }
        throw new Error('Invalid scopes. need at least: [' + provider.scopes.join(', ') + ']');
      })
    );
  }

  disconnectProvider(type: ProviderType): void {
    this.gitProviderService.disconnectProvider(type);
  }

}