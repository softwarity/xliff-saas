import { inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { ProviderType } from '../../shared/models/provider-type';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';
import { TokenService } from './token.service';

export interface GitProvider {
  type: ProviderType;
  connected: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GitProviderService {
  private tokenService = inject(TokenService);
  private auth = inject(AuthService);
  private toastService = inject(ToastService);

  private providersSignal = signal<GitProvider[]>([]);

  
  providers$ = toObservable(this.providersSignal);

  constructor() {
    this.auth.isAuthenticated$.subscribe({
      next: () => {
        this.loadProviderStatuses();
      }
    });
  }

  private loadProviderStatuses() {
    this.tokenService.getStatusProviders().subscribe({
      next: (providers) => {
        this.providersSignal.set(providers);
      }
    });
  }

  updateProvider(providerType: ProviderType, connected: boolean) {
    this.providersSignal.update(providers => 
      providers.map(p => p.type === providerType ? { ...p, connected: connected } : p)
    );
  }

  getToken(provider: ProviderType): Observable<string | null> {
    return this.tokenService.getToken(provider);
  }

  storeTokenValidated(providerType: ProviderType, token: string): Observable<void> {
    return this.tokenService.storeToken(providerType, token).pipe(
      map(success => {
        if (success) {
          this.updateProvider(providerType, true);
          return void 0;
        }
        throw new Error('Failed to store token');
      })
    );
  }

  disconnectProvider(type: ProviderType): void {
    this.tokenService.removeToken(type).subscribe({
      next: (success) => {
        if (success) {
          this.updateProvider(type, false);
          this.toastService.success($localize`:@@PROVIDER_DISCONNECTED_SUCCESS:Successfully disconnected from ${type}`);
        }
      },
      error: (error: Error) => {
        this.toastService.error($localize`:@@FAILED_TO_DISCONNECT_PROVIDER:Failed to disconnect from ${type}. Please try again.`);
      }
    });
  }


}