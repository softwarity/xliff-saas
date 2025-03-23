import { inject, Injectable } from '@angular/core';
import { RealtimeChannel, RealtimePostgresChangesPayload, RealtimePostgresDeletePayload, RealtimePostgresInsertPayload, RealtimePostgresUpdatePayload } from '@supabase/supabase-js';
import { SupabaseClientService } from '../../../core/services/supabase-client.service';
import { from, map, Observable, share, Subscriber } from 'rxjs';
import { Credit } from '../../../shared/models/credit.model';


@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private supabaseClientService = inject(SupabaseClientService);
  private observable$: Observable<Credit | null>;
  private channel: RealtimeChannel | undefined = undefined;
  constructor() {
    this.observable$ = new Observable<RealtimePostgresChangesPayload<Credit>>((observer: Subscriber<RealtimePostgresChangesPayload<Credit>>) => {
      from(this.supabaseClientService.from('user_credits').select<'*', Credit>('*').limit(1)).subscribe({
        next: ({ data, error }: { data: Credit[] | null, error: any }) => {
          if (error) {
            console.error('Error fetching estimations:', error);
          } else {
            if (data) {
              data.forEach((credit) => {
                console.log('Credit fetched in observable:', credit);
                observer.next({eventType: 'UPDATE', new: credit, old: {}, schema: 'public', table: 'user_credits', commit_timestamp: '', errors: []});
              });
            }
          }
        }
      });
      this.channel = this.supabaseClientService.realtime.channel('user_credits')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_credits' }, (payload: RealtimePostgresInsertPayload<Credit>) => {
        console.log('Credit inserted in channel:', payload);
        observer.next(payload);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user_credits' }, (payload: RealtimePostgresUpdatePayload<Credit>) => {
        console.log('Credit updated in channel:', payload);
        observer.next(payload);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'user_credits' }, (payload: RealtimePostgresDeletePayload<Credit>) => {
        console.log('Credit deleted in channel:', payload);
        observer.next(payload);
      });
      this.channel.subscribe();
    }).pipe(
      map((payload: RealtimePostgresChangesPayload<Credit>) => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          return payload.new;
        } else {
          return {balance: 0};
        }
      }),
      share()
    );

  }

  subscribeToCreditChanges(): Observable<Credit | null> {
    return this.observable$;
  }

  closeChannel() {
    console.log('Closing channel');
    this.channel?.unsubscribe();
  }
}