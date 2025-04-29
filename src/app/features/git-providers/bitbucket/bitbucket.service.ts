import { Injectable, inject } from '@angular/core';
import { Observable, from, map, switchMap, tap } from 'rxjs';
import { GitProviderService } from '../../../core/services/git-provider.service';
import { ToastService } from '../../../core/services/toast.service';

export const SCOPES: string[] = ['repository', 'repository:write', 'pullrequest', 'pullrequest:write', 'account'];

@Injectable()
export class BitbucketService {
  private toastService = inject(ToastService);

  private gitProviderService = inject(GitProviderService);

  validateAndStoreToken(token: string): Observable<void> {
    return this.testBitbucketToken(token).pipe(
      switchMap(() => this.gitProviderService.storeTokenValidated('bitbucket', token)),
      tap({
        next: () => {
          this.toastService.success($localize`:@@BITBUCKET_CONNECTED_SUCCESS:Successfully connected to Bitbucket`);
        },
        error: (err) => {
          this.toastService.error($localize`:@@FAILED_TO_CONNECT_BITBUCKET:Failed to connect to Bitbucket. ${err.message}`);  
        }
      })
    );
  }

  private testBitbucketToken(token: string): Observable<void> {
      let bitbucket = {
      url: `https://api.bitbucket.org/2.0/user`,
      headers: {
        'Authorization': `Basic ${btoa(token)}`,
        'Accept': 'application/json'
      }
    };

    return from(fetch(bitbucket.url, { headers: bitbucket.headers })).pipe(
      map((response: Response) => {
        if (response.ok) {
          return void 0;
        }
        throw new Error('Invalid scopes. need at least: [' + SCOPES.join(', ') + ']');
      })
    );
  }

  disconnectProvider(): void {
    this.gitProviderService.disconnectProvider('bitbucket');
  }
}