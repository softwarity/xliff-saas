import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ProviderType } from '../../shared/models/provider-type';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private auth = inject(AuthService);

  storeToken(provider: ProviderType, token: string): Observable<boolean> {
    return this.auth.saveGitToken(provider, token);
  }

  getToken(provider: ProviderType): Observable<string | null> {
    return this.auth.getGitToken(provider);
  }

  removeToken(provider: ProviderType): Observable<boolean> {
    return this.auth.removeGitToken(provider);
  }

  // getGitToken(provider: ProviderType): Observable<string | null> {
  //   const user = this.userSubject.value;
  //   if (!user) {
  //     console.log('No user found, returning null token');
  //     return of(null);
  //   }
  //   return from(this.supabase.from('user_metadata').select('git_tokens').eq('userId', user.id).single()).pipe(
  //     map((response: SupabaseResponse<Pick<UserMetadata, 'git_tokens'>>) => {
  //       if (response.error) {
  //         console.error('Error fetching token:', response.error);
  //         return null;
  //       }
  //       const tokens: Record<ProviderType, string> = response.data?.git_tokens || {} as Record<ProviderType, string>;
  //       return tokens[provider] || null;
  //     }),
  //     catchError(error => {
  //       console.error('Error in getGitToken:', error);
  //       return of(null);
  //     })
  //   );
  // }

  // saveGitToken(provider: ProviderType, token: string): Observable<boolean> {
  //   const user = this.userSubject.value;
  //   if (!user) return of(false);

  //   return from(this.supabase.from('user_metadata').select('git_tokens').eq('userId', user.id).single()).pipe(
  //     switchMap((response: SupabaseResponse<Pick<UserMetadata, 'git_tokens'>>) => {
  //       const currentTokens = response.data?.git_tokens || {};
  //       const updatedTokens = { ...currentTokens, [provider]: token };

  //       if (response.data) {
  //         return from(this.supabase.from('user_metadata').update({ git_tokens: updatedTokens }).eq('userId', user.id));
  //       } else {
  //         return from(this.supabase.from('user_metadata').insert([{ userId: user.id, git_tokens: updatedTokens }]));
  //       }
  //     }),
  //     map((response: SupabaseResponse<unknown>) => {
  //       if (response.error) {
  //         console.error('Error saving token:', response.error);
  //         return false;
  //       }
  //       return true;
  //     }),
  //     catchError(error => {
  //       console.error('Error in saveGitToken:', error);
  //       return of(false);
  //     })
  //   );
  // }

  // removeGitToken(provider: ProviderType): Observable<boolean> {
  //   const user = this.userSubject.value;
  //   if (!user) return of(false);

  //   return from(this.supabase.from('user_metadata').select('git_tokens').eq('userId', user.id).single()).pipe(
  //     switchMap((response: SupabaseResponse<Pick<UserMetadata, 'git_tokens'>>) => {
  //       if (response.error) {
  //         return throwError(() => new Error(response.error?.message || 'Error fetching git tokens'));
  //       }
  //       const currentTokens: Record<ProviderType, string> = response.data?.git_tokens || {} as Record<ProviderType, string>;
  //       const { [provider]: _, ...remainingTokens } = currentTokens;
        
  //       return from(this.supabase.from('user_metadata').update({ git_tokens: remainingTokens }).eq('userId', user.id));
  //     }),
  //     map((response: SupabaseResponse<unknown>) => {
  //       if (response.error) {
  //         console.error('Error removing token:', response.error);
  //         return false;
  //       }
  //       return true;
  //     }),
  //     catchError(error => {
  //       console.error('Error in removeGitToken:', error);
  //       return of(false);
  //     })
  //   );
  // }
}