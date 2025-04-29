import { Injectable, inject } from '@angular/core';
import { Observable, from, map, switchMap, tap } from 'rxjs';
import { GitProviderService } from '../../../core/services/git-provider.service';
import { ToastService } from '../../../core/services/toast.service';

export const SCOPES: string[] = ['api', 'read_user', 'read_api', 'read_repository', 'write_repository'];

@Injectable()
export class GitlabService {
  private toastService = inject(ToastService);
  private gitProviderService = inject(GitProviderService);

  validateAndStoreToken(token: string): Observable<void> {
    return this.testGitlabToken(token).pipe(
      switchMap(() => this.gitProviderService.storeTokenValidated('gitlab', token)),
      tap({
        next: () => {
          this.toastService.success($localize`:@@GITLAB_CONNECTED_SUCCESS:Successfully connected to GitLab`);
        },
        error: (err) => {
          this.toastService.error($localize`:@@FAILED_TO_CONNECT_GITLAB:Failed to connect to GitLab. ${err.message}`);
        }
      })
    );
  }

  private testGitlabToken(token: string): Observable<void> {
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
        throw new Error('Invalid scopes. need at least: [' + SCOPES.join(', ') + ']');
      })
    );
  }

  disconnectProvider(): void {
    this.gitProviderService.disconnectProvider('gitlab');
  }

}