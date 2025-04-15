import { Injectable, inject } from '@angular/core';
import { Observable, catchError, from, map, of } from 'rxjs';
import { SupabaseClientService } from '../../core/services/supabase-client.service';
import { ToastService } from '../../core/services/toast.service';

@Injectable()
export class SupportService {
  private readonly supabaseClientService = inject(SupabaseClientService);
  private readonly toastService = inject(ToastService);

  /**
   * Get the list of issues
   */
  getIssues(page: number, perPage: number, filters: {search?: string, state?: string, type?: string}): Observable<{data: Issue[], pagination: {totalCount: number, totalPages: number, currentPage: number, hasNextPage: boolean, hasPreviousPage: boolean}}> {
    const body = { page, perPage, filters };
    return from(this.supabaseClientService.functions.invoke('issue', { method: 'PUT',body })).pipe(
      map(response => {
        if (response.error) {
          this.toastService.error($localize`:@@FAILED_TO_GET_ISSUES:Failed to get issues. Please try again later.`);
          throw new Error('Failed to get issues');
        }
        return response.data;
      })
    );
  }

  /**
   * Create a new issue
   * @param issue - Issue data
   */
  createIssue(issue: CreateIssue): Observable<Issue | null> {
    return from(this.supabaseClientService.functions.invoke<Issue>('issue', {method: 'POST', body: issue})).pipe(
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
    return from(this.supabaseClientService.functions.invoke<Issue>(`issue/${id}`, { method: 'PUT', body: issue })).pipe(
      map(response => {
        if (response.error) {
          this.toastService.error($localize`:@@FAILED_TO_UPDATE_ISSUE:Failed to update issue. Please try again later.`);
        } else if (response.data) {
          // Si un état est fourni, afficher un message approprié
          if (issue.state === 'closed') {
            this.toastService.success($localize`:@@ISSUE_CLOSED_SUCCESSFULLY:Issue closed successfully.`);
          } else if (issue.state === 'open') {
            this.toastService.success($localize`:@@ISSUE_REOPENED_SUCCESSFULLY:Issue reopened successfully.`);
          } else {
            this.toastService.success($localize`:@@ISSUE_UPDATED_SUCCESSFULLY:Issue updated successfully.`);
          }
        }
        return response.data;
      })
    );
  }

  /**
   * Récupère une issue spécifique par son ID
   */
  getIssue(id: number): Observable<Issue> {
    return from(this.supabaseClientService.functions.invoke<Issue>(`issue/${id}`, { method: 'GET' })).pipe(
      map(response => {
        if (response.error) {
          this.toastService.error($localize`:@@FAILED_TO_GET_ISSUE:Failed to get issue. Please try again later.`);
          throw new Error('Failed to fetch issue');
        }
        return response.data as Issue;
      })
    );
  }

  /**
   * Ajoute un commentaire à une issue
   */
  addComment(issueId: number, comment: string): Observable<any> {
    return from(this.supabaseClientService.functions.invoke<any>(`issue/${issueId}/comment`, { 
      method: 'POST', 
      body: { comment } 
    })).pipe(
      map(response => {
        if (response.error) {
          this.toastService.error($localize`:@@FAILED_TO_ADD_COMMENT:Failed to add comment. Please try again later.`);
          throw new Error('Failed to add comment');
        }
        this.toastService.success($localize`:@@COMMENT_ADDED_SUCCESSFULLY:Comment added successfully.`);
        return response.data;
      })
    );
  }

  /**
   * Récupère les commentaires d'une issue
   */
  getComments(issueId: number): Observable<any[]> {
    return from(this.supabaseClientService.functions.invoke<any[]>(`issue/${issueId}/comment`, { method: 'GET' })).pipe(
      map(response => {
        if (response.error) {
          this.toastService.error($localize`:@@FAILED_TO_GET_COMMENTS:Failed to get comments. Please try again later.`);
          throw new Error('Failed to fetch comments');
        }
        return response.data as any[];
      })
    );
  }

  /**
   * Ferme une issue
   */
  closeIssue(issueId: number): Observable<Issue> {
    return from(this.supabaseClientService.functions.invoke<Issue>(`issue/${issueId}`, { 
      method: 'PATCH', 
      body: { state: 'closed' } 
    })).pipe(
      map(response => {
        if (response.error) {
          this.toastService.error($localize`:@@FAILED_TO_CLOSE_ISSUE:Failed to close issue. Please try again later.`);
          throw new Error('Failed to close issue');
        }
        this.toastService.success($localize`:@@ISSUE_CLOSED_SUCCESSFULLY:Issue closed successfully.`);
        return response.data as Issue;
      })
    );
  }

  /**
   * Rouvre une issue
   */
  reopenIssue(issueId: number): Observable<Issue> {
    return from(this.supabaseClientService.functions.invoke<Issue>(`issue/${issueId}`, { 
      method: 'PATCH', 
      body: { state: 'open' } 
    })).pipe(
      map(response => {
        if (response.error) {
          this.toastService.error($localize`:@@FAILED_TO_REOPEN_ISSUE:Failed to reopen issue. Please try again later.`);
          throw new Error('Failed to reopen issue');
        }
        this.toastService.success($localize`:@@ISSUE_REOPENED_SUCCESSFULLY:Issue reopened successfully.`);
        return response.data as Issue;
      })
    );
  }

  /**
   * Supprime une issue (si elle est fermée)
   */
  deleteIssue(issueId: number): Observable<boolean> {
    return from(this.supabaseClientService.functions.invoke<any>(`issue/${issueId}`, { method: 'DELETE' })).pipe(
      map(response => {
        if (response.error) {
          this.toastService.error($localize`:@@FAILED_TO_DELETE_ISSUE:Failed to delete issue. Please try again later.`);
          return false;
        }
        this.toastService.success($localize`:@@ISSUE_DELETED_SUCCESSFULLY:Issue deleted successfully.`);
        return true;
      })
    );
  }

  sendContactForm(email: string, subject: string, message: string): Observable<boolean> {
    const contactData = {
      email,
      subject,
      message
    };
    
    return from(this.supabaseClientService.functions.invoke('contact', {
      method: 'POST',
      body: contactData
    })).pipe(
      map(response => {
        if (response.error) {
          this.toastService.error($localize`:@@FAILED_TO_SEND_CONTACT:Failed to send message. Please try again later.`);
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.toastService.error($localize`:@@FAILED_TO_SEND_CONTACT:Failed to send message. Please try again later.`);
        return of(false);
      })
    );
  } 
} 