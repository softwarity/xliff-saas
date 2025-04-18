import { Injectable, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, from, map, switchMap, catchError, throwError } from 'rxjs';
import { ProviderType } from '../../shared/models/provider-type';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { ToastService } from './toast.service';

export interface GitProvider {
  name: string;
  type: ProviderType;
  connected: boolean;
  tokenHint?: string;
  scopes: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GitProviderService {
  private tokenService = inject(TokenService);
  private auth = inject(AuthService);
  private toastService = inject(ToastService);

  private providersSignal = signal<GitProvider[]>([
    { 
      name: 'GitHub',
      type: 'github',
      connected: false,
      tokenHint: 'Settings > Developer settings > Personal access tokens > Tokens (classic) > Generate new token',
      scopes: [
        'repo',              // Full control of private repositories
        // 'read:user',         // Read user profile data
        'read:org',         // Read organization profile data
        // 'workflow',          // Update GitHub Action workflows
        // 'write:discussion'   // Create and update discussions (for PRs)
      ]
    },
    { 
      name: 'GitLab',
      type: 'gitlab',
      connected: false,
      tokenHint: 'Settings > Access Tokens > Add new token',
      scopes: [
        'api',              // API access
        'read_user',        // Read user information
        'read_api',         // Read-only access to API
        'read_repository',  // Read-only access to repositories
        'write_repository'  // Read-write access to repositories
      ]
    },
    { 
      name: 'Bitbucket',
      type: 'bitbucket',
      connected: false,
      tokenHint: 'Settings > Access tokens > Create token',
      scopes: [
        'repository',       // Read and write access to repositories
        'repository:write', // Write access to repositories
        'pullrequest',     // Read and write pull requests
        'pullrequest:write', // Write access to pull requests
        'account'          // Read account information
      ]
    }
  ]);

  hasConfiguredProviderSignal = signal<boolean>(false);
  
  providers$ = toObservable(this.providersSignal);
  hasConfiguredProvider$ = toObservable(this.hasConfiguredProviderSignal);

  constructor() {
    // Écouter les changements d'authentification
    this.auth.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.loadProviderStatuses();
      } else {
        // Réinitialiser les providers quand l'utilisateur se déconnecte
        this.providersSignal.update(providers => 
          providers.map(p => ({ ...p, connected: false }))
        );
        this.hasConfiguredProviderSignal.set(false);
      }
    });
  }

  private loadProviderStatuses() {
    const providers = this.providersSignal();
    providers.forEach(provider => {
      this.tokenService.getToken(provider.type).subscribe({
        next: (token) => {
          if (token) {
            this.providersSignal.update(providers => 
              providers.map(p => p.type === provider.type ? { ...p, connected: true } : p)
            );
            this.updateConfiguredStatus();
          }
        },
        error: (error: Error) => {
          this.toastService.error($localize`:@@FAILED_TO_LOAD_PROVIDER_STATUS:Failed to load ${provider.name} status. Please try again.`);
        }
      });
    });
  }

  validateAndStoreToken(provider: GitProvider, token: string): Observable<void> {
    let testToken$: Observable<void>;
    if (provider.type === 'github') {
       testToken$ = this.testGithubToken(provider, token);
    } else if (provider.type === 'gitlab') {
      testToken$ = this.testGitlabToken(provider, token);
    } else {
      testToken$ = this.testBitbucketToken(provider, token);
    }
    return testToken$.pipe(
      switchMap(() => {
        return this.tokenService.storeToken(provider.type, token).pipe(
          map(success => {
            if (success) {
              this.providersSignal.update(providers => 
                providers.map(p => p.type === provider.type ? { ...p, connected: true } : p)
              );
              this.updateConfiguredStatus();
              this.toastService.success($localize`:@@PROVIDER_CONNECTED_SUCCESS:Successfully connected to ${provider.name}`);
              return void 0;
            }
            throw new Error('Failed to store token');
          })
        );
      }),
      catchError((error: Error) => {
        this.toastService.error($localize`:@@FAILED_TO_CONNECT_PROVIDER:Failed to connect to ${provider.name}. ${error.message}`);
        return throwError(() => error);
      })
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

  getToken(provider: ProviderType): Observable<string | null> {
    return this.tokenService.getToken(provider);
  }

  disconnectProvider(type: ProviderType): void {
    this.tokenService.removeToken(type).subscribe({
      next: (success) => {
        if (success) {
          this.providersSignal.update(providers => 
            providers.map(p => p.type === type ? { ...p, connected: false } : p)
          );
          this.updateConfiguredStatus();
          this.toastService.success($localize`:@@PROVIDER_DISCONNECTED_SUCCESS:Successfully disconnected from ${type}`);
        }
      },
      error: (error: Error) => {
        this.toastService.error($localize`:@@FAILED_TO_DISCONNECT_PROVIDER:Failed to disconnect from ${type}. Please try again.`);
      }
    });
  }

  private updateConfiguredStatus(): void {
    const hasConnected = this.providersSignal().some(p => p.connected);
    this.hasConfiguredProviderSignal.set(hasConnected);
  }
}