import { Injectable, inject, signal } from '@angular/core';
import { TokenService } from './token.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, from, map, catchError, switchMap, of } from 'rxjs';
import { AuthService } from './auth.service';
import { ProviderType } from '../../shared/models/provider-type';

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

  private providersSignal = signal<GitProvider[]>([
    { 
      name: 'GitHub',
      type: 'github',
      connected: false,
      tokenHint: 'Settings > Developer settings > Personal access tokens > Tokens (classic) > Generate new token',
      scopes: [
        'repo',              // Full control of private repositories
        'read:user',         // Read user profile data
        'workflow',          // Update GitHub Action workflows
        'write:discussion'   // Create and update discussions (for PRs)
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
    console.log('Loading provider statuses...');
    const providers = this.providersSignal();
    providers.forEach(provider => {
      this.tokenService.getToken(provider.type).subscribe(token => {
        console.log(`Checking token for ${provider.type}:`, !!token);
        if (token) {
          this.providersSignal.update(providers => 
            providers.map(p => p.type === provider.type ? { ...p, connected: true } : p)
          );
          this.updateConfiguredStatus();
        }
      });
    });
  }

  validateAndStoreToken(provider: ProviderType, token: string): Observable<boolean> {
    return this.testToken(provider, token).pipe(
      switchMap(isValid => {
        if (!isValid) return of(false);
        
        return this.tokenService.storeToken(provider, token).pipe(
          map(success => {
            if (success) {
              this.providersSignal.update(providers => 
                providers.map(p => p.type === provider ? { ...p, connected: true } : p)
              );
              this.updateConfiguredStatus();
            }
            return success;
          }),
          catchError(() => of(false))
        );
      })
    );
  }

  private testToken(provider: ProviderType, token: string): Observable<boolean> {
    const endpoints = {
      github: {
        url: 'https://api.github.com/user',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      },
      gitlab: {
        url: 'https://gitlab.com/api/v4/user',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      },
      bitbucket: {
        url: `https://api.bitbucket.org/2.0/user`,
        headers: {
          'Authorization': `Basic ${btoa(token)}`,
          'Accept': 'application/json'
        }
      }
    };

    const config = endpoints[provider as keyof typeof endpoints];
    
    if (!config) return of(false);
    return from(fetch(config.url, { headers: config.headers })).pipe(
      map(response => response.ok),
      catchError((error) => {
        console.log(error);
        return of(false);
      })
    );
  }

  getToken(provider: ProviderType): Observable<string | null> {
    return this.tokenService.getToken(provider);
  }

  disconnectProvider(type: ProviderType): void {
    this.tokenService.removeToken(type).subscribe(success => {
      if (success) {
        this.providersSignal.update(providers => 
          providers.map(p => p.type === type ? { ...p, connected: false } : p)
        );
        this.updateConfiguredStatus();
      }
    });
  }

  private updateConfiguredStatus(): void {
    const hasConnected = this.providersSignal().some(p => p.connected);
    this.hasConfiguredProviderSignal.set(hasConnected);
  }
}