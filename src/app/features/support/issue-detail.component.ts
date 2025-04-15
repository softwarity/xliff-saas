import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupportService } from './support.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ConfirmModalComponent],
  providers: [SupportService],
  template: `
    <div class="container py-8">
      <div class="flex items-center mb-8 gap-4">
        <a [routerLink]="['/support']" class="text-primary hover:underline flex items-center gap-1" i18n="@@BACK_TO_SUPPORT">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Support
        </a>
        
        <button *ngIf="issue() && issue()!.state === 'open'" (click)="closeIssue()" class="button flat-warning ml-auto" i18n="@@CLOSE_ISSUE">
          Close Issue
        </button>
        
        <button *ngIf="issue() && issue()!.state === 'closed'" (click)="reopenIssue()" class="button flat-primary ml-auto" i18n="@@REOPEN_ISSUE">
          Reopen Issue
        </button>
        
        <button *ngIf="issue() && issue()!.state === 'closed'" (click)="confirmDelete()" class="button stroke-warning" i18n="@@DELETE_ISSUE">
          Delete Issue
        </button>
        
        <button (click)="refreshData()" class="button stroke-primary flex items-center gap-1">
          <svg [class.animate-spin]="isLoading()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span i18n="@@REFRESH">Refresh</span>
        </button>
      </div>
      
      <div *ngIf="isLoading()" class="flex justify-center p-8">
        <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <ng-container *ngIf="!isLoading() && issue()">
        <!-- Issue Header -->
        <div class="bg-white dark:bg-dark-800 rounded-lg shadow-md mb-6 p-6">
          <div class="flex items-center gap-2 mb-3">
            <span *ngIf="issue()!.state === 'open'" class="text-green-500 bg-green-100 dark:bg-green-900/20 rounded-full px-3 py-1 text-xs uppercase font-medium" i18n="@@ISSUE_STATE_OPEN">Open</span>
            <span *ngIf="issue()!.state === 'closed'" class="text-red-500 bg-red-100 dark:bg-red-900/20 rounded-full px-3 py-1 text-xs uppercase font-medium" i18n="@@ISSUE_STATE_CLOSED">Closed</span>
            <span class="text-gray-500 dark:text-gray-400 text-sm">#{{ issue()!.number }}</span>
            <span *ngIf="issue()!.type === 'Bug'" class="badge warning" i18n="@@TICKET_TYPE_BUG_LABEL">Bug</span>
            <span *ngIf="issue()!.type === 'Feature'" class="badge primary" i18n="@@TICKET_TYPE_FEATURE_LABEL">Feature</span>
          </div>
          
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ issue()!.title }}</h1>
          
          <div class="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 mb-6">
            <!-- <markdown [data]="issue()!.body" class="prose dark:prose-invert max-w-none"></markdown> -->
          </div>
          
          <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-4">
            <span i18n="@@CREATED_BY">Created by: {{ issue()!.user?.login || 'Unknown' }}</span>
            <span i18n="@@CREATED_AT">Created: {{ issue()!.created_at | date:'medium' }}</span>
            <span *ngIf="issue()!.updated_at" i18n="@@UPDATED_AT">Updated: {{ issue()!.updated_at | date:'medium' }}</span>
          </div>
        </div>
        
        <!-- Comments Section -->
        <div class="bg-white dark:bg-dark-800 rounded-lg shadow-md mb-6">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white" i18n="@@COMMENTS">Comments ({{ comments().length }})</h2>
          </div>
          
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div *ngFor="let comment of comments()" class="p-6">
              <div class="flex items-start mb-4">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <span class="font-medium text-gray-900 dark:text-white mr-2">{{ comment.user?.login || 'Unknown' }}</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">{{ comment.created_at | date:'medium' }}</span>
                  </div>
                  <!-- <markdown [data]="comment.body" class="prose dark:prose-invert max-w-none"></markdown> -->
                </div>
              </div>
            </div>
            
            <div *ngIf="comments().length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400" i18n="@@NO_COMMENTS">
              No comments yet.
            </div>
          </div>
        </div>
        
        <!-- Add Comment Form -->
        <div *ngIf="issue()!.state === 'open'" class="bg-white dark:bg-dark-800 rounded-lg shadow-md">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4" i18n="@@ADD_COMMENT">Add a Comment</h3>
            
            <form [formGroup]="commentForm" (ngSubmit)="submitComment()">
              <div class="mb-4">
                <textarea
                  formControlName="comment"
                  rows="5"
                  class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
                  placeholder="Write your comment here... Markdown is supported."
                  i18n-placeholder="@@COMMENT_PLACEHOLDER"
                ></textarea>
                
                <div *ngIf="commentForm.get('comment')?.invalid && commentForm.get('comment')?.touched" class="text-red-500 text-sm mt-1" i18n="@@COMMENT_REQUIRED">
                  Comment is required
                </div>
              </div>
              
              <div class="flex justify-end">
                <button 
                  type="submit" 
                  class="button flat-primary" 
                  [disabled]="commentForm.invalid || isSubmitting()"
                  i18n="@@SUBMIT_COMMENT"
                >
                  <span *ngIf="!isSubmitting()">Submit Comment</span>
                  <span *ngIf="isSubmitting()" class="flex items-center gap-2">
                    <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <!-- <span i18n="@@SUBMITTING">Submitting...</span> -->
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </ng-container>
      
      <div *ngIf="!isLoading() && !issue()" class="bg-white dark:bg-dark-800 rounded-lg shadow-md p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2" i18n="@@ISSUE_NOT_FOUND">Issue Not Found</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6" i18n="@@ISSUE_NOT_FOUND_DESC">The issue you're looking for doesn't exist or you don't have permission to view it.</p>
        <a [routerLink]="['/support']" class="button flat-primary" i18n="@@BACK_TO_SUPPORT">Back to Support</a>
      </div>
    </div>
    @if (isConfirmModalOpen()) {
      <app-confirm-modal
        [title]="'Delete Issue'"
        [description]="'Are you sure you want to delete this issue? This action cannot be undone.'"
        [warning]="'This action will delete the issue and all associated comments.'"
        (closed)="onDeleteModalClosed($event)"
      ></app-confirm-modal>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 500;
      line-height: 1;
      border-radius: 9999px;
      text-transform: uppercase;
    }
  `]
})
export class IssueDetailComponent {
  private readonly supportService = inject(SupportService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  
  
  protected readonly issue = signal<any | null>(null);
  protected readonly comments = signal<any[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly isConfirmModalOpen = signal(false);
  protected readonly commentForm: FormGroup;
  
  constructor() {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
    this.route.paramMap.pipe(
      takeUntilDestroyed()
    ).subscribe(params => {
      const issueId = params.get('id');
      if (issueId) {
        this.loadIssueData(Number(issueId));
      }
    });
  }
  
  
  private loadIssueData(issueId: number): void {
    this.isLoading.set(true);
    
    // Charger les détails de l'issue
    this.supportService.getIssue(issueId).pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: (data) => {
        this.issue.set(data);
        this.loadComments(issueId);
      },
      error: () => {
        this.issue.set(null);
        this.isLoading.set(false);
      }
    });
  }
  
  private loadComments(issueId: number): void {
    this.supportService.getComments(issueId).pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: (data) => {
        this.comments.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.comments.set([]);
        this.isLoading.set(false);
      }
    });
  }
  
  protected refreshData(): void {
    if (this.issue()) {
      this.loadIssueData(this.issue()!.number);
    }
  }
  
  protected submitComment(): void {
    if (this.commentForm.invalid || !this.issue()) {
      return;
    }
    
    this.isSubmitting.set(true);
    const comment = this.commentForm.get('comment')!.value;
    
    this.supportService.addComment(this.issue()!.number, comment).pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: () => {
        this.commentForm.reset();
        this.isSubmitting.set(false);
        this.loadComments(this.issue()!.number);
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }
  
  protected closeIssue(): void {
    if (!this.issue() || this.issue()!.state !== 'open') {
      return;
    }
    
    this.isLoading.set(true);
    this.supportService.closeIssue(this.issue()!.number).pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: () => {
        this.refreshData();
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
  
  protected reopenIssue(): void {
    if (!this.issue() || this.issue()!.state !== 'closed') {
      return;
    }
    
    this.isLoading.set(true);
    this.supportService.reopenIssue(this.issue()!.number).pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: () => {
        this.refreshData();
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
  
  protected confirmDelete(): void {
    if (!this.issue() || this.issue()!.state !== 'closed') {
      return;
    }
    this.isConfirmModalOpen.set(true);
  }
  
  private deleteIssue(): void {
    if (!this.issue()) {
      return;
    }
    
    this.isLoading.set(true);
    this.supportService.deleteIssue(this.issue()!.number).pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['/support']);
        } else {
          this.isLoading.set(false);
        }
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  protected onDeleteModalClosed(result: boolean): void {
    this.isConfirmModalOpen.set(false);
    if (result) {
      this.deleteIssue();
    }
  }
} 