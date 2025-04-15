import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SupportService } from './support.service';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  providers: [SupportService],
  template: `
    <div class="container mx-auto py-8 px-4">
      <div class="flex items-center mb-8 gap-4">
        <a [routerLink]="['/support']" class="text-primary hover:underline flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span i18n="@@BACK_TO_SUPPORT">Back to Support</span>
        </a>
        
        @if (isOpenIssue()) {
          <button (click)="closeIssue()" class="button stroke-warning ml-auto" i18n="@@CLOSE_ISSUE">
            Close Issue
          </button>
        } @else {
          <button (click)="reopenIssue()" class="button stroke-primary ml-auto" i18n="@@REOPEN_ISSUE">
            Reopen Issue
          </button>
        }
      </div>
      
      @if (isLoading()) {
        <div class="flex justify-center p-8">
          <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      }
      
      @if (!issueExists()) {
        <div class="bg-white dark:bg-dark-800 rounded-lg shadow-md p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2" i18n="@@ISSUE_NOT_FOUND">Issue Not Found</h2>
          <p class="text-gray-500 dark:text-gray-400 mb-6" i18n="@@ISSUE_NOT_FOUND_DESC">The issue you're looking for doesn't exist or you don't have permission to view it.</p>
          <a [routerLink]="['/support']" class="button flat-primary" i18n="@@BACK_TO_SUPPORT">Back to Support</a>
        </div>
      } @else {
        <!-- Issue Header -->
        <div class="bg-white dark:bg-dark-800 rounded-lg shadow-md mb-6 p-6">
          <div class="flex items-center gap-2 mb-3">
            @if (isOpenIssue()) {
              <span class="text-green-500 bg-green-100 dark:bg-green-900/20 rounded-full px-3 py-1 text-xs uppercase font-medium" i18n="@@ISSUE_STATE_OPEN">Open</span>
            } @else {
              <span class="text-red-500 bg-red-100 dark:bg-red-900/20 rounded-full px-3 py-1 text-xs uppercase font-medium" i18n="@@ISSUE_STATE_CLOSED">Closed</span>
            }
            <span class="text-gray-500 dark:text-gray-400 text-sm">#{{ issue()!.number }}</span>
            @if (issue()!.type.name === 'Bug') {
              <span class="badge warning" i18n="@@TICKET_TYPE_BUG_LABEL">Bug</span>
            } @else {
              <span class="badge primary" i18n="@@TICKET_TYPE_FEATURE_LABEL">Feature</span>
            }
          </div>
          
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ issue()!.title }}</h1>
          
          <div class="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 mb-4">
            <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ issue()!.body }}</p>
          </div>
          
          <div class="text-sm text-gray-500 dark:text-gray-400">
            <span i18n="@@CREATED_AT">Created: {{ issue()!.created_at | date:'medium' }}</span>
          </div>
        </div>
        
        <!-- Comments Section -->
        <div class="bg-white dark:bg-dark-800 rounded-lg shadow-md mb-6">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white" i18n="@@COMMENTS">Comments ({{ comments().length }})</h2>
          </div>
          
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            @if (comments().length === 0) {
              <div class="text-center text-gray-500 dark:text-gray-400 py-8" i18n="@@NO_COMMENTS">
                No comments yet.
              </div>
            } @else {
              @for (comment of comments(); track comment.id) {
                <div class="p-6">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                      <div class="w-2 h-2 rounded-full mr-2 {{comment.support ? 'bg-blue-600 dark:bg-blue-400' : 'bg-gray-400 dark:bg-gray-600'}}"></div>
                      @if (comment.support) {
                        <span class="font-medium text-blue-700 dark:text-blue-300" i18n="@@SUPPORT_TEAM">Support Team</span>
                      } @else {
                        <span class="font-medium text-gray-800 dark:text-gray-300" i18n="@@YOU">You</span>
                      }
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ comment.created_at | date:'medium' }}</span>
                  </div>
                  
                  <div class="ml-4 {{comment.support ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-gray-50 dark:bg-gray-800/50'}} rounded-lg p-4">
                    <p class="{{comment.support ? 'text-blue-800 dark:text-blue-200' : 'text-gray-800 dark:text-gray-200'}} whitespace-pre-wrap">{{ comment.body }}</p>
                  </div>
                </div>
              }
            }
          </div>
        </div>
        
        @if (isOpenIssue()) {
          <div class="bg-white dark:bg-dark-800 rounded-lg shadow-md">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4" i18n="@@ADD_COMMENT">Add a Comment</h3>
              
              <form [formGroup]="commentForm" (ngSubmit)="submitComment()">
                <div class="mb-4">
                  <textarea
                    formControlName="comment"
                    rows="4"
                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
                    placeholder="Write your reply here..."
                    i18n-placeholder="@@COMMENT_PLACEHOLDER"
                  ></textarea>
                  
                  @if (commentForm.get('comment')?.invalid && commentForm.get('comment')?.touched) {
                    <div class="text-red-500 text-sm mt-1" i18n="@@COMMENT_REQUIRED">
                      Comment is required
                    </div>
                  }
                </div>
                
                <div class="flex justify-end">
                  <button 
                    type="submit" 
                    class="button flat-primary" 
                    [disabled]="commentForm.invalid || isSubmitting()"
                  >
                    @if (!isSubmitting()) {
                      <span i18n="@@SUBMIT_COMMENT">Submit Comment</span>
                    } @else {
                      <span class="flex items-center gap-2">
                        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span i18n="@@SUBMITTING">Submitting...</span>
                      </span>
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class IssueDetailComponent {
  private readonly supportService = inject(SupportService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  
  protected readonly issue = signal<any | null>(null);
  protected readonly comments = signal<any[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly isSubmitting = signal(false);
  
  protected readonly issueExists = computed(() => !!this.issue());
  protected readonly isOpenIssue = computed(() => this.issue()?.state === 'open');
  protected readonly isClosedIssue = computed(() => this.issue()?.state === 'closed');
  
  protected readonly commentForm: FormGroup;
  
  constructor() {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
    
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const issueId = params.get('id');
        if (issueId) {
          this.loadIssueData(Number(issueId));
        }
      });
  }
  
  private loadIssueData(issueId: number): void {
    this.isLoading.set(true);
    
    this.supportService.getIssue(issueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
    this.supportService.getComments(issueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
    
    this.supportService.addComment(this.issue()!.number, comment)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
    if (!this.isOpenIssue()) {
      return;
    }
    
    this.isLoading.set(true);
    this.supportService.closeIssue(this.issue()!.number)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.refreshData();
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
  }
  
  protected reopenIssue(): void {
    if (!this.isClosedIssue()) {
      return;
    }
    
    this.isLoading.set(true);
    this.supportService.reopenIssue(this.issue()!.number)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.refreshData();
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
  }
} 