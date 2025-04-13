import { inject, Injectable } from '@angular/core';
import { RealtimeChannel, RealtimePostgresDeletePayload, RealtimePostgresInsertPayload, RealtimePostgresUpdatePayload } from '@supabase/supabase-js';
import { BehaviorSubject, catchError, from, Observable, shareReplay, throwError } from 'rxjs';
import { Credit } from '../../shared/models/credit.model';
import { SupabaseClientService } from './supabase-client.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private supabaseClientService = inject(SupabaseClientService);
  private toastService = inject(ToastService);
  private balanceSubject = new BehaviorSubject<number>(0);
  balance$ = this.balanceSubject.asObservable().pipe(shareReplay());
  private channel: RealtimeChannel | undefined = undefined;
  constructor() {
    this.#getUserCredits();
    this.#listenToCreditsUpdates();
  }

  #getUserCredits() {
    from(this.supabaseClientService.from('user_credits').select<'*', Credit>('*').limit(1)).pipe(
      catchError(error => {
        console.error('Error fetching credits:', error);
        this.toastService.error($localize `:@@BALANCE_SERVICE_ERROR_FETCHING_CREDITS:Error fetching credits`);
        return throwError(() => error);
      })
    ).subscribe({
      next: ({ data, error }: { data: Credit[] | null, error: any }) => {
        if (error) {
          console.error('Error fetching credits:', error);
          this.toastService.error($localize `:@@BALANCE_SERVICE_ERROR_FETCHING_CREDITS:Error fetching credits`);
        } else {
          if (data) {
            data.forEach((credit) => {
              this.balanceSubject.next(credit.balance);
            });
          }
        }
      }
    });
  }

  #listenToCreditsUpdates() {
    this.channel = this.supabaseClientService.realtime.channel('user_credits')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_credits' }, (payload: RealtimePostgresInsertPayload<Credit>) => {
      this.balanceSubject.next(payload.new.balance);
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user_credits' }, (payload: RealtimePostgresUpdatePayload<Credit>) => {
      this.balanceSubject.next(payload.new.balance);
    })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'user_credits' }, (payload: RealtimePostgresDeletePayload<Credit>) => {
      this.balanceSubject.next(0);
    });
    this.channel.subscribe();
  }

  subscribeToBalanceChanges(): Observable<number> {
    return this.balance$;
  }

  closeChannel() {
    this.channel?.unsubscribe();
  }
}