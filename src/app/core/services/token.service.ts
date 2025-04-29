import { inject, Injectable } from '@angular/core';
import { catchError, from, map, Observable, of } from 'rxjs';
import { ProviderType } from '../../shared/models/provider-type';
import { AuthService } from './auth.service';
import { SupabaseClientService } from './supabase-client.service';
import { ToastService } from './toast.service';
import { GitProvider } from './git-provider.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private auth = inject(AuthService);
  private supabase = inject(SupabaseClientService);
  private toastService = inject(ToastService);

  storeToken(provider: ProviderType, token: string): Observable<boolean> {
    return from(this.supabase.auth.updateUser({data: { [provider]: token }})).pipe(
      map(() => true),
      catchError((error) => {
        this.toastService.error($localize`:@@FAILED_TO_STORE_TOKEN:Failed to store ${provider} token. Please try again later.`);
        return of(false);
      })
    );
  }

  getStatusProviders(): Observable<GitProvider[]> {
    const providers: GitProvider[] = [
      { 
        type: 'github',
        connected: false
      },
      { 
        type: 'gitlab',
        connected: false
      },
      { 
        type: 'bitbucket',
        connected: false
      }
    ];
    return from(this.auth.getUser()).pipe(
      map((user) => {
        if (!user) throw new Error('User not found');
        for (const provider of providers) {
          provider.connected = !!user.user_metadata[provider.type] || false;
        }
        return [...providers];
      }),
      catchError((error) => {
        return of([...providers]);
      })
    );
  }
  
  getToken(provider: ProviderType): Observable<string | null> {
    return from(this.auth.getUser()).pipe(
      map((user) => {
        return user?.user_metadata[provider] || null;
      }),
      catchError((error) => {
        this.toastService.error($localize`:@@FAILED_TO_GET_TOKEN:Failed to get ${provider} token. Please try again later.`);
        return of(null);
      })
    );
  }

  removeToken(provider: ProviderType): Observable<boolean> {
    return from(this.supabase.auth.updateUser({data: { [provider]: null }})).pipe(
      map(() => true),
      catchError((error) => {
        this.toastService.error($localize`:@@FAILED_TO_REMOVE_TOKEN:Failed to remove ${provider} token. Please try again later.`);
        return of(false);
      })
    );
  }
}