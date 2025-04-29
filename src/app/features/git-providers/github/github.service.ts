import { Injectable, inject } from '@angular/core';
import { Observable, from, map, switchMap, tap } from 'rxjs';
import { GitProviderService } from '../../../core/services/git-provider.service';
import { ToastService } from '../../../core/services/toast.service';

export const SCOPES: string[] = ['repo', 'read:org'];

@Injectable()
export class GithubService {
  private toastService = inject(ToastService);
  private gitProviderService = inject(GitProviderService);

  validateAndStoreToken(token: string): Observable<void> {
    return this.testGithubToken(token).pipe(
      switchMap(() => this.gitProviderService.storeTokenValidated('github', token)),
      tap({
        next: () => {
          this.toastService.success($localize`:@@GITHUB_CONNECTED_SUCCESS:Successfully connected to Github`);
        },
        error: (err) => {
          this.toastService.error($localize`:@@FAILED_TO_CONNECT_GITHUB:Failed to connect to Github. ${err.message}`);  
        }
      })
    );
  }

  private testGithubToken(token: string): Observable<void> {
    const github = { 
      url: 'https://api.github.com/user',
      headers: {'Authorization': `token ${token}`, }
    };
    return from(fetch(github.url, { headers: github.headers })).pipe(
      map((response: Response) => {
        const scopes = response.headers.get('x-oauth-scopes')?.split(', ') || [];
        if (response.ok && SCOPES.every(scope => scopes.includes(scope))) {
          return void 0;
        }
        throw new Error('Invalid scopes. need at least: [' + SCOPES.join(', ') + ']');
      })
    );
  }

  disconnectProvider(): void {
    this.gitProviderService.disconnectProvider('github');
  }
}