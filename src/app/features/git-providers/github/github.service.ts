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
export class GithubService {
  private gitProviderService = inject(GitProviderService);

  validateAndStoreToken(provider: GitProvider, token: string): Observable<void> {
    return this.testGithubToken(provider, token).pipe(
      switchMap(() => this.gitProviderService.storeTokenValidated(provider, token))
    );
  }

  private testGithubToken(provider: GitProvider, token: string): Observable<void> {
    const github = { 
      url: 'https://api.github.com/user',
      headers: {'Authorization': `token ${token}`, }
    };
    return from(fetch(github.url, { headers: github.headers })).pipe(
      map((response: Response) => {
        const scopes = response.headers.get('x-oauth-scopes')?.split(', ') || [];
        if (response.ok && provider.scopes.every(scope => scopes.includes(scope))) {
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