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
export class BitbucketService {
  private gitProviderService = inject(GitProviderService);

  validateAndStoreToken(provider: GitProvider, token: string): Observable<void> {
    return this.testBitbucketToken(provider, token).pipe(
      switchMap(() => this.gitProviderService.storeTokenValidated(provider, token))
    );
  }

  private testBitbucketToken(provider: GitProvider, token: string): Observable<void> {
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
        throw new Error('Invalid scopes. need at least: [' + provider.scopes.join(', ') + ']');
      })
    );
  }

  disconnectProvider(type: ProviderType): void {
    this.gitProviderService.disconnectProvider(type);
  }
}