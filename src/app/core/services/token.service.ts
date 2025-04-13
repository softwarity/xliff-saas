import { inject, Injectable } from '@angular/core';
import { catchError, from, map, Observable, of } from 'rxjs';
import { ProviderType } from '../../shared/models/provider-type';
import { AuthService } from './auth.service';
import { SupabaseClientService } from './supabase-client.service';
import { ToastService } from './toast.service';

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
    return from(this.supabase.auth.updateUser({data: { [provider]: undefined }})).pipe(
      map(() => true),
      catchError((error) => {
        this.toastService.error($localize`:@@FAILED_TO_REMOVE_TOKEN:Failed to remove ${provider} token. Please try again later.`);
        return of(false);
      })
    );
  }
}