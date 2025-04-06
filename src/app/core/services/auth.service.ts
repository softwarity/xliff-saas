import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, catchError, from, map, of, switchMap, throwError } from 'rxjs';
import { ProviderType } from '../../shared/models/provider-type';
import { SupabaseResponse, UserMetadata } from '../../shared/models/user-metadata.model';
import { SupabaseClientService } from './supabase-client.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseClientService);
  private router = inject(Router);
  
  private userSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  user$ = this.userSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    console.log('AuthService: Initializing...');

    this.supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthService: Initial session check:', { hasSession: !!session });
      this.updateAuthState(session?.user ?? null);
    });

    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log('AuthService: Auth state change:', { event, hasSession: !!session });
      this.updateAuthState(session?.user ?? null);
    });
  }

  private updateAuthState(user: User | null): void {
    console.log('AuthService: Updating auth state:', { hasUser: !!user }); 
    this.userSubject.next(user);
    this.isAuthenticatedSubject.next(!!user);
  }

  async signIn(email: string, password: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Erreur de connexion:', error.message);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  }

  async signUp(email: string, password: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.auth.signUp({ email, password });
      if (error) {
        console.error('Erreur d\'inscription:', error.message);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return false;
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.supabase.auth.signOut();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      throw error;
    }
  }

  getGitToken(provider: ProviderType): Observable<string | null> {
    const user = this.userSubject.value;
    if (!user) {
      console.log('No user found, returning null token');
      return of(null);
    }
    return from(this.supabase.from('user_metadata').select('git_tokens').eq('user_id', user.id).single()).pipe(
      map((response: SupabaseResponse<Pick<UserMetadata, 'git_tokens'>>) => {
        if (response.error) {
          console.error('Error fetching token:', response.error);
          return null;
        }
        const tokens: Record<ProviderType, string> = response.data?.git_tokens || {} as Record<ProviderType, string>;
        return tokens[provider] || null;
      }),
      catchError(error => {
        console.error('Error in getGitToken:', error);
        return of(null);
      })
    );
  }

  saveGitToken(provider: ProviderType, token: string): Observable<boolean> {
    const user = this.userSubject.value;
    if (!user) return of(false);

    return from(this.supabase.from('user_metadata').select('git_tokens').eq('user_id', user.id).single()).pipe(
      switchMap((response: SupabaseResponse<Pick<UserMetadata, 'git_tokens'>>) => {
        const currentTokens = response.data?.git_tokens || {};
        const updatedTokens = { ...currentTokens, [provider]: token };

        if (response.data) {
          return from(this.supabase.from('user_metadata').update({ git_tokens: updatedTokens }).eq('user_id', user.id));
        } else {
          return from(this.supabase.from('user_metadata').insert([{ user_id: user.id, git_tokens: updatedTokens }]));
        }
      }),
      map((response: SupabaseResponse<unknown>) => {
        if (response.error) {
          console.error('Error saving token:', response.error);
          return false;
        }
        return true;
      }),
      catchError(error => {
        console.error('Error in saveGitToken:', error);
        return of(false);
      })
    );
  }

  removeGitToken(provider: ProviderType): Observable<boolean> {
    const user = this.userSubject.value;
    if (!user) return of(false);

    return from(this.supabase.from('user_metadata').select('git_tokens').eq('user_id', user.id).single()).pipe(
      switchMap((response: SupabaseResponse<Pick<UserMetadata, 'git_tokens'>>) => {
        if (response.error) {
          return throwError(() => new Error(response.error?.message || 'Error fetching git tokens'));
        }
        const currentTokens: Record<ProviderType, string> = response.data?.git_tokens || {} as Record<ProviderType, string>;
        const { [provider]: _, ...remainingTokens } = currentTokens;
        
        return from(this.supabase.from('user_metadata').update({ git_tokens: remainingTokens }).eq('user_id', user.id));
      }),
      map((response: SupabaseResponse<unknown>) => {
        if (response.error) {
          console.error('Error removing token:', response.error);
          return false;
        }
        return true;
      }),
      catchError(error => {
        console.error('Error in removeGitToken:', error);
        return of(false);
      })
    );
  }

  signInWithGoogle() {
    return from(this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    }));
  }
}