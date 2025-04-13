import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { Job } from '../../shared/models/job.model';
import { Repository } from '../../shared/models/repository.model';
import { SupabaseClientService } from './supabase-client.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private supabaseClientService = inject(SupabaseClientService);
  private toastService = inject(ToastService);

  estimateRepository(repository: Repository, {branch, ext, transUnitState}: {branch: string, ext: string, transUnitState: string}): Observable<Job> {
    const { namespace, name, provider } = repository;
    const request = { namespace, name, branch, ext, transUnitState };
    return from(this.supabaseClientService.functions.invoke<{message: string, job: Job}>(`estimate/${provider}`, {method: 'POST', body: request})).pipe(
      map(response => {
        if (response.error) {
          this.toastService.error($localize`:@@FAILED_TO_ESTIMATE_REPOSITORY:Failed to estimate repository. Please try again later.`);
          throw new Error('Error estimating repository');
        }
        return response.data;
      }),
      map(data => {
        if(data?.job) {
          return data.job;
        }
        this.toastService.error($localize`:@@FAILED_TO_ESTIMATE_REPOSITORY:Failed to estimate repository. Please try again later.`);
        throw new Error('Error estimating repository');
      })
    );
  }

  translateRepository(repository: Repository, {branch, ext, transUnitState, procedeedTransUnitState}: {branch: string, ext: string, transUnitState: string, procedeedTransUnitState: string}): Observable<Job> {
    const { namespace, name, provider } = repository;
    const request = { namespace, name, branch, ext, transUnitState, procedeedTransUnitState };
    return from(this.supabaseClientService.functions.invoke<{message: string, job: Job}>(`translate/${provider}`, {method: 'POST', body: request})).pipe(
      map(response => {
        if (response.error) {
          this.toastService.error($localize`:@@FAILED_TO_TRANSLATE_REPOSITORY:Failed to translate repository. Please try again later.`);
          throw new Error('Error translating repository');
        }
        return response.data;
      }),
      map(data => {
        if(data?.job) {
          return data.job;
        }
        this.toastService.error($localize`:@@FAILED_TO_TRANSLATE_REPOSITORY:Failed to translate repository. Please try again later.`);
        throw new Error('Error translating repository');
      })
    );
  }
}
