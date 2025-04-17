import { inject, Injectable } from '@angular/core';
import { PostgrestResponse, RealtimeChannel, RealtimePostgresChangesPayload, RealtimePostgresDeletePayload, RealtimePostgresInsertPayload, RealtimePostgresUpdatePayload } from '@supabase/supabase-js';
import { filter, from, map, Observable, share, Subscriber } from 'rxjs';
import { Job } from '../../shared/models/job.model';
import { SupabaseClientService } from './supabase-client.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private supabaseClientService = inject(SupabaseClientService);
  private toastService = inject(ToastService);
  private observable$: Observable<{jobId: string, key: string, value: Job | null}>;
  private channel: RealtimeChannel | undefined = undefined;

  constructor() {
    this.observable$ = new Observable<RealtimePostgresChangesPayload<Job>>((observer: Subscriber<RealtimePostgresChangesPayload<Job>>) => {
      from(this.supabaseClientService.from('latest_user_jobs').select<'*', Job>('*').limit(100)).subscribe({
        next: ({ data, error }: { data: Job[] | null, error: any }) => {
          if (error) {
            this.toastService.error($localize`:@@FAILED_TO_FETCH_JOBS:Failed to fetch jobs. Please try again later.`);
          } else {
            if (data) {
              data.forEach((job) => {
                observer.next({eventType: 'UPDATE', new: job, old: {}, schema: 'public', table: 'user_jobs', commit_timestamp: '', errors: []});
              });
            }
          }
        }
      });
      this.channel = this.supabaseClientService.realtime.channel('user_jobs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_jobs' }, (payload: RealtimePostgresInsertPayload<Job>) => {
        observer.next(payload);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user_jobs' }, (payload: RealtimePostgresUpdatePayload<Job>) => {
        observer.next(payload);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'user_jobs' }, (payload: RealtimePostgresDeletePayload<Job>) => {
        observer.next(payload);
      });
      this.channel.subscribe();
    }).pipe(
      map((payload: RealtimePostgresChangesPayload<Job>) => {
        let key;
        let jobId;
        let value = null;
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          const { request, provider, namespace, repository, id } = payload.new;
          key = `${request}/${provider}/${namespace}/${repository}`;
          jobId = id!;
          value = payload.new;
        } else {
          const { request, provider, namespace, repository, id } = payload.old;
          key = `${request}/${provider}/${namespace}/${repository}`;
          jobId = id!;
          value = null;
        }
        return {jobId, key, value};
      }),
      share()
    );
  }

  subscribeToJobChanges(criteria: { provider: string, namespace: string, repository: string, request: 'estimation' | 'translation'}): Observable<Job | null>;
  subscribeToJobChanges(criteria: { jobId: string }): Observable<Job | null>;
  subscribeToJobChanges(criteria: { provider: string, namespace: string, repository: string, request: 'estimation' | 'translation'} | { jobId: string }): Observable<Job | null> {
    if ('jobId' in criteria) {
      return this.observable$.pipe(
        filter(({jobId}) => jobId === criteria.jobId),
        map(({value}) => value)
      )
    } else {
      const {request, provider, namespace, repository} = criteria;
      const lookupKey = `${request}/${provider}/${namespace}/${repository}`;
      return this.observable$.pipe(
        filter(({key}) => key === lookupKey),
        map(({value}) => value)
      )
    }
  }

  closeChannel() {
    this.channel?.unsubscribe();
  }

  getLastTranslationsInLastMonth(): Observable<number> {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString();
    let query = this.supabaseClientService.from('user_jobs').select('transUnitDone').in('status', ['completed']).lte('createdAt', lastDayOfMonth).gte('createdAt', firstDayOfMonth);
    return from(query).pipe(
      map(({data, error}: PostgrestResponse<{transUnitDone: number}>) => {
        if (error) {
          this.toastService.error($localize`:@@FAILED_TO_FETCH_MONTHLY_TRANSLATIONS:Failed to fetch monthly translations. Please try again later.`);
          return 0;
        }
        const totalUnits = data.reduce((acc, job) => acc + job.transUnitDone, 0);
        return totalUnits;
      })
    );
  }
  
  getJobs(status?: string[], page: number = 1, pageSize: number = 10): Observable<Paginated<Job>> {
    let query = this.supabaseClientService.from('user_jobs').select('*', { count: 'exact', head: false });
    
    if (status && status.length > 0) {
      query = query.in('status', status);
    }

    return from(query.range((page - 1) * pageSize, page * pageSize - 1).order('createdAt', { ascending: false })).pipe(
      map(({data, count, error}: PostgrestResponse<Job>) => {
        if (error) {
          this.toastService.error($localize`:@@FAILED_TO_FETCH_JOBS:Failed to fetch jobs. Please try again later.`);
          return { data: [], count: 0, error };
        }
        const res = { 
          data: data || [], 
          count: count || 0, 
          error: null 
        };
        return res;
      })
    );
  }

  cancelJob(jobId: string): Observable<void> {
    return from(this.supabaseClientService.functions.invoke<void>(`cancel-job/${jobId}`, {method: 'GET'})).pipe(
      map(response => {
        if (response.error) {
          this.toastService.error($localize`:@@FAILED_TO_CANCEL_JOB:Failed to cancel job. Please try again later.`);
        }
        return response.data || void 0;
      })
    );
  }
}