import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, catchError, from, map, of, throwError, switchMap } from 'rxjs';
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
    const emailRedirectTo: string = `${window.location.origin}${this.baseUrl}verify-email`;
    return from(this.supabase.auth.signUp({  email, password, options: { emailRedirectTo } })).pipe(
      map(response => {
        if (response.error) {
          console.error('Signup error:', response.error);
          throw response.error;
        }
        // Check if user is created but not confirmed
        if (response.data?.user && !response.data.user.email_confirmed_at) {
          console.log('User created but email not confirmed');
        }
      }),
      catchError(error => {
        console.error('Caught signup error:', error);
        let errorMessage = '';
        
        // Check for specific error cases
        if (error.message?.includes('already')) {
          errorMessage = $localize `:@@AUTH_SERVICE_EMAIL_EXISTS:This email is already in use`;
        } else if (error.message?.includes('password')) {
          errorMessage = $localize `:@@AUTH_SERVICE_PASSWORD_REQUIREMENTS:Password does not meet security requirements`;
        } else {
          errorMessage = $localize `:@@AUTH_SERVICE_GENERAL_ERROR:An error occurred during account creation: ${error.message}`;
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  signInWithGoogle(): Observable<void> {
    const redirectTo = `${window.location.origin}${this.baseUrl}`;
    return from(this.supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: { redirectTo }
    })).pipe(
      map(response => {
        console.log('OAuth response:', response);
        if (response.error) throw response.error;
        return void 0;
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
    const emailRedirectTo: string = `${window.location.origin}${this.baseUrl}verify-email`;
    return from(this.supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo  } })).pipe(
      map(response => {
        if (response.error) {
          console.error('Resend API error:', response.error);
          throw response.error;
        }
      })
    );
  }

  verifyEmail(email: string, token: string): Observable<void> {
    return from(this.supabase.auth.verifyOtp({ email, token, type: 'signup' })).pipe(
      map(response => {
        if (response.error) throw response.error;
      })
    );
  }

  resetPassword(email: string): Observable<void> {
    if (!email) {
      return throwError(() => new Error($localize `:@@AUTH_SERVICE_NO_EMAIL:No email address provided`));
    }
    const emailRedirectTo: string = `${window.location.origin}${this.baseUrl}auth/update-password`;
    return from(this.supabase.auth.resetPasswordForEmail(email, { redirectTo: emailRedirectTo })).pipe(
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

  updatePassword(newPassword: string): Observable<void> {
    return from(this.supabase.auth.updateUser({ password: newPassword })).pipe(
      map(({ error }) => {
        if (error) throw error;
        return void 0;
      })
    );
  }

  private initializeUser(): void {
    console.log('Initializing user...');
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', JSON.stringify(session, null, 2));
      console.log('Initial user:', session?.user);
      console.log('Initial access token:', session?.access_token);
      this.updateAuthState(session?.user ?? null);
    }).catch(error => {
      console.error('Error getting initial session:', error);
    });
  }
}