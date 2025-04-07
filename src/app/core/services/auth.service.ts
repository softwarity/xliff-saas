import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, catchError, from, map, of } from 'rxjs';
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

  signInWithEmail(email: string, password: string): Observable<void> {
    return from(this.supabase.auth.signInWithPassword({ email, password })).pipe(
      map(response => {
        if (response.error) throw response.error;
      })
    );
  }

  signUp(email: string, password: string): Observable<void> {
    return from(this.supabase.auth.signUp({ email, password })).pipe(
      map(response => {
        if (response.error) throw response.error;
      })
    );
  }

  signInWithGoogle(): Observable<void> {
    return from(this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // redirectTo: `${window.location.origin}/auth/callback`
        redirectTo: `${window.location.href}`
      }
    })).pipe(
      map(response => {
        if (response.error) throw response.error;
      })
    );
  }

  signOut(): Observable<void> {
    return from(this.supabase.auth.signOut()).pipe(
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
}