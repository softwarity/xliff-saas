import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthResponse, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, catchError, from, map, of, switchMap, tap, throwError } from 'rxjs';
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

  getUser(): Observable<User | null> {
    return from(this.supabase.auth.getSession()).pipe(
      map(({data: {session}}) => {
        return session?.user || null}
      ),
      catchError(() => of(null))
    );
  }

  private updateAuthState(user: User | null): void {
    console.log('AuthService: Updating auth state:', { hasUser: !!user }, user); 
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

  deleteAccount(): Observable<void> {
    return from(this.supabase.functions.invoke<void>(`delete-account`, {method: 'POST'})).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
      switchMap(() => this.signOut()),
    );
  }

  signInWithGoogle(): Observable<OAuthResponse> {
    return from(this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.href}`
      }
    }));
  }
}