import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, catchError, from, map, of, throwError, switchMap } from 'rxjs';
import { BASE_URL } from '../tokens/base-url.token';
import { SupabaseClientService } from './supabase-client.service';
import { ToastService } from './toast.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseClientService);
  private router = inject(Router);
  private baseUrl = inject(BASE_URL);
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);
  
  private userSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private avatarSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public avatar$ = this.avatarSubject.asObservable();

  user$ = this.userSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
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
      )
    );
  }

  private updateAuthState(user: User | null): void {
    this.userSubject.next(user);
    this.isAuthenticatedSubject.next(!!user);
    const avatar_url = user?.user_metadata['avatar_url'] || null;
    this.avatarSubject.next(avatar_url);

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
      }),
      catchError(error => {
        console.error('Sign in error:', error);
        if (error.message?.includes('Invalid login credentials')) {
          this.toastService.error($localize `:@@AUTH_SERVICE_INVALID_CREDENTIALS:Invalid email or password`);
        } else {
          this.toastService.error($localize `:@@AUTH_SERVICE_SIGN_IN_ERROR:Error signing in`);
        }
        return throwError(() => error);
      })
    );
  }

  signUp(email: string, password: string): Observable<void> {
    const emailRedirectTo: string = `${this.getOrigin()}verify-email`;
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
        if (error.message?.includes('already')) {
          this.toastService.error($localize `:@@AUTH_SERVICE_EMAIL_EXISTS:This email is already in use`);
        } else if (error.message?.includes('password')) {
          this.toastService.error($localize `:@@AUTH_SERVICE_PASSWORD_REQUIREMENTS:Password does not meet security requirements`);
        } else {
          this.toastService.error($localize `:@@AUTH_SERVICE_GENERAL_ERROR:An error occurred during account creation: ${error.message}`);
        }
        return throwError(() => error);
      })
    );
  }

  signInWithGoogle(): Observable<void> {
    return from(this.supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: { redirectTo: this.getOrigin() }
    })).pipe(
      map(response => {
        if (response.error) throw response.error;
        return void 0;
      }),
      catchError(error => {
        console.error('Google sign in error:', error);
        this.toastService.error($localize `:@@AUTH_SERVICE_GOOGLE_SIGN_IN_ERROR:Error signing in with Google`);
        return throwError(() => error);
      })
    );
  }

  signOut(): Observable<void> {
    return from(this.supabase.auth.signOut()).pipe(
      map(response => {
        if (response.error) throw response.error;
        this.router.navigate(['/']);
      }),
      catchError(error => {
        console.error('Sign out error:', error);
        this.toastService.error($localize `:@@AUTH_SERVICE_SIGN_OUT_ERROR:Error signing out`);
        return throwError(() => error);
      })
    );
  }

  resendConfirmationEmail(email: string): Observable<void> {
    if (!email) {
      return throwError(() => new Error($localize `:@@AUTH_SERVICE_NO_EMAIL:No email address provided`));
    }
    console.log('Resending confirmation email to:', email);
    const emailRedirectTo: string = `${this.getOrigin()}verify-email`;
    return from(this.supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo  } })).pipe(
      map(response => {
        if (response.error) {
          console.error('Resend API error:', response.error);
          throw response.error;
        }
      }),
      catchError(error => {
        console.error('Resend confirmation email error:', error);
        this.toastService.error($localize `:@@AUTH_SERVICE_RESEND_CONFIRMATION_ERROR:Error resending confirmation email`);
        return throwError(() => error);
      })
    );
  }

  verifyEmail(email: string, token: string): Observable<void> {
    return from(this.supabase.auth.verifyOtp({ email, token, type: 'signup' })).pipe(
      map(response => {
        if (response.error) throw response.error;
      }),
      catchError(error => {
        console.error('Verify email error:', error);
        this.toastService.error($localize `:@@AUTH_SERVICE_VERIFY_EMAIL_ERROR:Error verifying email`);
        return throwError(() => error);
      })
    );
  }

  resetPassword(email: string): Observable<void> {
    if (!email) {
      return throwError(() => new Error($localize `:@@AUTH_SERVICE_NO_EMAIL:No email address provided`));
    }
    const emailRedirectTo: string = `${this.getOrigin()}auth/update-password`;
    return from(this.supabase.auth.resetPasswordForEmail(email, { redirectTo: emailRedirectTo })).pipe(
      map(response => {
        if (response.error) throw response.error;
      }),
      catchError(error => {
        console.error('Reset password error:', error);
        this.toastService.error($localize `:@@AUTH_SERVICE_RESET_PASSWORD_ERROR:Error resetting password`);
        return throwError(() => error);
      })
    );
  }

  getOrigin(): string {
    if (isPlatformBrowser(this.platformId)) {
      return `${window.location.origin}${this.baseUrl}`;
    }
    return '';
  }

  deleteAccount(): Observable<void> {
    return from(this.supabase.functions.invoke('delete-account')).pipe(
      map(response => {
        if (response.error) throw response.error;
      }),
      catchError(error => {
        console.error('Delete account error:', error);
        this.toastService.error($localize `:@@AUTH_SERVICE_DELETE_ACCOUNT_ERROR:Error deleting account`);
        return throwError(() => error);
      })
    );
  }

  updatePassword(newPassword: string): Observable<void> {
    return from(this.supabase.auth.updateUser({ password: newPassword })).pipe(
      map(({ error }) => {
        if (error) throw error;
        return void 0;
      }),
      catchError(error => {
        console.error('Update password error:', error);
        this.toastService.error($localize `:@@AUTH_SERVICE_UPDATE_PASSWORD_ERROR:Error updating password`);
        return throwError(() => error);
      })
    );
  }

  private initializeUser(): void {
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this.updateAuthState(session?.user ?? null);
    }).catch(error => {
      console.error('Error getting initial session:', error);
      this.toastService.error($localize `:@@AUTH_SERVICE_INITIALIZATION_ERROR:Error initializing user session`);
    });
  }

  public updateAvatar(avatar_url: string): void {
    this.avatarSubject.next(avatar_url);
  }
}