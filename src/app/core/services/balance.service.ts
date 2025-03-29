import { inject, Injectable } from '@angular/core';
import { RealtimeChannel, RealtimePostgresDeletePayload, RealtimePostgresInsertPayload, RealtimePostgresUpdatePayload } from '@supabase/supabase-js';
import { BehaviorSubject, from, Observable, shareReplay } from 'rxjs';
import { Credit } from '../../shared/models/credit.model';
import { SupabaseClientService } from './supabase-client.service';


@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private supabaseClientService = inject(SupabaseClientService);
  private balanceSubject = new BehaviorSubject<number>(0);
  balance$ = this.balanceSubject.asObservable().pipe(shareReplay());
  private channel: RealtimeChannel | undefined = undefined;
  constructor() {
    this.#getUserCredits();
    this.#listenToCreditsUpdates();
  }

  #getUserCredits() {
    from(this.supabaseClientService.from('user_credits').select<'*', Credit>('*').limit(1)).subscribe({
      next: ({ data, error }: { data: Credit[] | null, error: any }) => {
        if (error) {
          console.error('Error fetching estimations:', error);
        } else {
          if (data) {
            data.forEach((credit) => {
              console.log('Credit fetched in observable:', credit);
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
      console.log('Credit inserted in channel:', payload);
      this.balanceSubject.next(payload.new.balance);
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user_credits' }, (payload: RealtimePostgresUpdatePayload<Credit>) => {
      console.log('Credit updated in channel:', payload);
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
    console.log('Closing channel');
    this.channel?.unsubscribe();
  }
}