import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { Job } from '../../shared/models/job.model';
import { Repository } from '../../shared/models/repository.model';
import { SupabaseClientService } from './supabase-client.service';



@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private supabaseClientService = inject(SupabaseClientService);

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

  translateRepository(repository: Repository, {branch, ext, transUnitState, procedeedTransUnitState}: {branch: string, ext: string, transUnitState: string, procedeedTransUnitState: string}): Observable<Job> {
    const { namespace, name, provider } = repository;
    const request = { namespace, name, branch, ext, transUnitState, procedeedTransUnitState };
    return from(this.supabaseClientService.functions.invoke<{message: string, job: Job}>(`translate/${provider}`, {method: 'POST', body: request})).pipe(
      map(response => response.data),
      map(data => {
        if(data?.job) {
          return data.job;
        }
        throw new Error('Error translating repository');
      })
    );
  }
}
