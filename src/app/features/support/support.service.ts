import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { SupabaseClientService } from '../../core/services/supabase-client.service';
import { ToastService } from '../../core/services/toast.service';

@Injectable()
export class SupportService {
  private readonly supabaseClientService = inject(SupabaseClientService);
  private readonly toastService = inject(ToastService);

  /**
   * Récupère la liste des issues
   * @param params - Paramètres de filtrage
   */
  getIssues(page: number, perPage: number): Observable<{data: Issue[], count: number}> {
    return from(this.supabaseClientService.functions.invoke<{data: Issue[], count: number}>(`issue-list?page=${page}&per_page=${perPage}`, { method: 'GET' })).pipe(
      map(response => {
        if (response.error) {
          this.toastService.error($localize`:@@FAILED_TO_GET_ISSUES:Failed to get issues. Please try again later.`);
        }
        return response.data || {data: [], count: 0};
      })
    );
  }

  /**
   * Create a new issue
   * @param issue - Issue data
   */
  createIssue(issue: CreateIssue): Observable<Issue | null> {
    return from(this.supabaseClientService.functions.invoke<Issue>('issue-create', {method: 'POST', body: issue})).pipe(
      map(response => {
        if (response.error) {
          this.toastService.error($localize`:@@FAILED_TO_CREATE_ISSUE:Failed to create issue. Please try again later.`);
        }
        return response.data;
      })
    );
  }

  /**
   * Update an issue
   * @param id - Issue ID
   * @param issue - Issue data
   */
  updateIssue(id: number, issue: UpdateIssue): Observable<Issue | null> {
    return from(this.supabaseClientService.functions.invoke<Issue>(`issue-update/${id}`, { method: 'PATCH', body: issue })).pipe(
      map(response => {
        if (response.error) {
          this.toastService.error($localize`:@@FAILED_TO_UPDATE_ISSUE:Failed to update issue. Please try again later.`);
        }
        return response.data;
      })
    );
  }

  /**
   * Get a specific issue
   * @param id - Issue ID
   */
  getIssue(id: number): Observable<Issue | null> {
    return from(this.supabaseClientService.functions.invoke<Issue>(`issue/${id}`, { method: 'GET' })).pipe(
      map(response => {
        if (response.error) {
          this.toastService.error($localize`:@@FAILED_TO_GET_ISSUE:Failed to get issue. Please try again later.`);
        }
        return response.data;
      })
    );
  }
} 