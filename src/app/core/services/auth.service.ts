import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, catchError, from, map, of, pipe, throwError } from 'rxjs';
import { BASE_URL } from '../tokens/base-url.token';
import { SupabaseClientService } from './supabase-client.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseClientService);
  private router = inject(Router);
  private baseUrl = inject(BASE_URL);
  
  private userSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  user$ = this.userSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    console.log('AuthService: Initializing...');
    this.initializeUser();

    // Surveiller les événements d'authentification
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.updateAuthState(session?.user || null);
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
    this.userSubject.next(user);
    this.isAuthenticatedSubject.next(!!user);
  }

  isEmailConfirmed(): boolean {
    const user = this.userSubject.value;
    
    // Si l'utilisateur s'est authentifié via OAuth2, considérer l'email comme vérifié
    if (this.isOAuthUser()) {
      return true;
    }
    
    // Vérifier si l'utilisateur existe et si son email est confirmé
    return !!user?.email_confirmed_at || !!user?.confirmed_at;
  }

  isOAuthUser(): boolean {
    const user = this.userSubject.value;
    if (!user) return false;
    
    // Vérifier si l'utilisateur s'est authentifié via un provider OAuth
    return !!user.app_metadata?.provider && 
           user.app_metadata.provider !== 'email' && 
           user.app_metadata.provider !== 'phone';
  }

  getCurrentUserEmail(): string | null {
    return this.userSubject.value?.email ?? null;
  }

  signInWithEmail(email: string, password: string): Observable<void> {
    return from(this.supabase.auth.signInWithPassword({ email, password })).pipe(
      map(response => {
        if (response.error) throw response.error;
      })
    );
  }

  signUp(email: string, password: string): Observable<void> {
    const emailRedirectTo: string = `${this.baseUrl}auth/verify`;
    return from(this.supabase.auth.signUp({  email, password, options: { emailRedirectTo } })).pipe(
      map(response => {
        if (response.error) throw response.error;
      })
    );
  }

  signInWithGoogle(): Observable<void> {
    const redirectTo: string = this.baseUrl;
    return from(this.supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectTo } })).pipe(
      map(response => {
        if (response.error) throw response.error;
      })
    );
  }

  signOut(): Observable<void> {
    return from(this.supabase.auth.signOut()).pipe(
      map(response => {
        if (response.error) throw response.error;
        this.router.navigate(['/']);
      })
    );
  }

  resendConfirmationEmail(email: string): Observable<void> {
    if (!email) {
      return throwError(() => new Error($localize `:@@AUTH_SERVICE_NO_EMAIL:No email address provided`));
    }
    console.log('Resending confirmation email to:', email);
    const emailRedirectTo: string = `${this.baseUrl}auth/verify`;
    return from(this.supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo  } })).pipe(
      map(response => {
        console.log('Resend API response:', response);
        if (response.error) {
          console.error('Resend API error:', response.error);
          throw response.error;
        }
      })
    );
  }

  verifyEmail(token: string): Observable<void> {
    return from(this.supabase.auth.verifyOtp({
      token_hash: token,
      type: 'signup'
    })).pipe(
      map(response => {
        if (response.error) throw response.error;
      })
    );
  }

  deleteAccount(): Observable<void> {
    return from(this.supabase.functions.invoke('delete-account')).pipe(
      map(response => {
        if (response.error) throw response.error;
      })
    );
  }

  private initializeUser(): void {
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this.updateAuthState(session?.user ?? null);
    });
  }
}