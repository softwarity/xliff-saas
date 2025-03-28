import { Injectable, inject } from '@angular/core';
import { Observable, from, map, of } from 'rxjs';
import { SupabaseClientService } from '../../../core/services/supabase-client.service';
import { ProviderType } from '../../../shared/models/provider-type';
import { Repository } from '../../../shared/models/repository.model';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Job } from '../../../shared/models/job.model';



@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private supabaseClientService = inject(SupabaseClientService);

  getRepositories(provider: ProviderType): Observable<Repository[]> {
    return from(this.supabaseClientService.functions.invoke<Repository[]>(`repository-${provider}`, {method: 'GET'})).pipe(
      map(response => response.data || [])
    );
  }

  getBranches(repository: Repository): Observable<string[]> {
    const { provider, url } = repository;
    return from(this.supabaseClientService.functions.invoke<string[]>(`branch-${provider}?url=${encodeURIComponent(url)}`, {method: 'GET'})).pipe(
      map(response => response.data || [])
    );
  }

  estimateRepository(repository: Repository, {branch, ext, transUnitState}: {branch: string, ext: string, transUnitState: string}): Observable<Job> {
    const { namespace, name, provider } = repository;
    const request = { namespace, name, branch, ext, transUnitState };
    return from(this.supabaseClientService.functions.invoke<{message: string, job: Job}>(`estimate/${provider}`, {method: 'POST', body: request})).pipe(
      map(response => response.data),
      map(data => {
        if(data?.job) {
          return data.job;
        }
        throw new Error('Error estimating repository');
      })
    );
  }

  translateRepository(repository: Repository, {branch, ext, transUnitState, procedeedTransUnitState}: {branch: string, ext: string, transUnitState: string, procedeedTransUnitState: string}): Observable<string> {
    const { namespace, name, provider } = repository;
    const request = { namespace, name, branch, ext, transUnitState, procedeedTransUnitState };
    return from(this.supabaseClientService.functions.invoke<{message: string, jobId: string}>(`translate/${provider}`, {method: 'POST', body: request})).pipe(
      map(response => response.data),
      map(data => {
        if(data?.jobId) {
          return data.jobId;
        }
        throw new Error('Error estimating repository');
      })
    );
  }
}
