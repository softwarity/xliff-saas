import { inject, Injectable } from '@angular/core';
import { RealtimeChannel, RealtimePostgresChangesPayload, RealtimePostgresDeletePayload, RealtimePostgresInsertPayload, RealtimePostgresUpdatePayload } from '@supabase/supabase-js';
import { debounceTime, filter, from, map, Observable, share, Subscriber } from 'rxjs';
import { SupabaseClientService } from '../../../core/services/supabase-client.service';
import { Estimation } from '../../../shared/models/estimation.model';



@Injectable({
  providedIn: 'root'
})
export class EstimationService {
  private supabaseClientService = inject(SupabaseClientService);
  private observable$: Observable<{key: string, value: Estimation | null}>;
  private channel: RealtimeChannel | undefined = undefined;
  constructor() {
    this.observable$ = new Observable<RealtimePostgresChangesPayload<Estimation>>((observer: Subscriber<RealtimePostgresChangesPayload<Estimation>>) => {
      from(this.supabaseClientService.from('user_estimations').select<'*', Estimation>('*').limit(100)).subscribe({
        next: ({ data, error }: { data: Estimation[] | null, error: any }) => {
          if (error) {
            console.error('Error fetching estimations:', error);
          } else {
            if (data) {
              data.forEach((estimation) => {
                console.log('Estimation fetched in observable:', estimation);
                observer.next({eventType: 'UPDATE', new: estimation, old: {}, schema: 'public', table: 'user_estimations', commit_timestamp: '', errors: []});
              });
            }
          }
        }
      });
      this.channel = this.supabaseClientService.realtime.channel('user_estimations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_estimations' }, (payload: RealtimePostgresInsertPayload<Estimation>) => {
        console.log('Estimation inserted in channel:', payload);
        observer.next(payload);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user_estimations' }, (payload: RealtimePostgresUpdatePayload<Estimation>) => {
        console.log('Estimation updated in channel:', payload);
        observer.next(payload);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'user_estimations' }, (payload: RealtimePostgresDeletePayload<Estimation>) => {
        console.log('Estimation deleted in channel:', payload);
        observer.next(payload);
      });
      this.channel.subscribe();
    }).pipe(
      map((payload: RealtimePostgresChangesPayload<Estimation>) => {
        let key;
        let value = null;;
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          const { namespace, repository } = payload.new;
          key = `${namespace}/${repository}`;
          value = payload.new;
        } else {
          const { namespace, repository } = payload.old;
          key = `${namespace}/${repository}`;
          value = null;
        }
        return {key, value};
      }),
      share()
    );

  }

  subscribeToEstimationChanges({ namespace, repository }: { namespace: string, repository: string }): Observable<Estimation | null> {
    const lookupKey = `${namespace}/${repository}`;
    return this.observable$.pipe(
      filter(({key}) => key === lookupKey),
      debounceTime(300),
      map(({value}) => value)
    )
  }

  closeChannel() {
    console.log('Closing channel');
    this.channel?.unsubscribe();
  }
}