import { inject, Injectable } from '@angular/core';
import { RealtimeChannel, RealtimePostgresChangesPayload, RealtimePostgresDeletePayload, RealtimePostgresInsertPayload, RealtimePostgresUpdatePayload } from '@supabase/supabase-js';
import { filter, from, map, Observable, of, share, Subscriber, switchMap } from 'rxjs';
import { SupabaseClientService } from './supabase-client.service';
import { Job } from '../../shared/models/job.model';



@Injectable({
  providedIn: 'root'
})
export class JobService {
  private supabaseClientService = inject(SupabaseClientService);
  private observable$: Observable<{key: string, request: 'estimation' | 'translation', value: Job | null}>;
  private channel: RealtimeChannel | undefined = undefined;
  constructor() {
    this.observable$ = new Observable<RealtimePostgresChangesPayload<Job>>((observer: Subscriber<RealtimePostgresChangesPayload<Job>>) => {
      from(this.supabaseClientService.from('user_jobs').select<'*', Job>('*').limit(100)).subscribe({
        next: ({ data, error }: { data: Job[] | null, error: any }) => {
          if (error) {
            console.error('Error fetching jobs:', error);
          } else {
            if (data) {
              data.forEach((job) => {
                console.log('Job fetched in observable:', job);
                observer.next({eventType: 'UPDATE', new: job, old: {}, schema: 'public', table: 'user_jobs', commit_timestamp: '', errors: []});
              });
            }
          }
        }
      });
      this.channel = this.supabaseClientService.realtime.channel('user_jobs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_jobs' }, (payload: RealtimePostgresInsertPayload<Job>) => {
        console.log('Job inserted in channel:', payload);
        observer.next(payload);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user_jobs' }, (payload: RealtimePostgresUpdatePayload<Job>) => {
        console.log('Job updated in channel:', payload);
        observer.next(payload);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'user_jobs' }, (payload: RealtimePostgresDeletePayload<Job>) => {
        console.log('Job deleted in channel:', payload);
        observer.next(payload);
      });
      this.channel.subscribe();
    }).pipe(
      map((payload: RealtimePostgresChangesPayload<Job>) => {
        let key;
        let value = null;
        let request: 'estimation' | 'translation';
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          const { provider, namespace, repository } = payload.new;
          request = payload.new.request!;
          key = `${provider}/${namespace}/${repository}`;
          value = payload.new;
        } else {
          const { provider, namespace, repository } = payload.old;
          request = payload.old.request!;
          key = `${provider}/${namespace}/${repository}`;
          value = null;
        }
        return {key, request, value};
      }),
      share()
    );

  }
  subscribeToJobChanges({ provider, namespace, repository }: { provider: string, namespace: string, repository: string }): Observable<{request: string, value: Job | null}> {
    const lookupKey = `${provider}/${namespace}/${repository}`;
    return this.observable$.pipe(
      filter(({key}) => key === lookupKey),
      map(({request, value}) => ({request, value}))
    )
  }

  closeChannel() {
    console.log('Closing channel');
    this.channel?.unsubscribe();
  }

  getJobs(): Observable<Job[]> {
    return from(this.supabaseClientService.from('user_jobs').select<'*', Job>('*').limit(100)).pipe(
      switchMap(({ data, error }: { data: Job[] | null, error: any }) => {
        if (error) {
          console.error('Error fetching jobs:', error);
          return of([]);
        } else {
          return of(data || []);
        }
      })
    );
  }
}