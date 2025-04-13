import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupportService } from './support.service';
import { finalize } from 'rxjs';

@Component({
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center mb-6">
        <a routerLink="/support" class="mr-3 text-primary hover:text-primary-hover">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </a>
        <h1 i18n="@@CREATE_TICKET_TITLE" class="text-2xl font-bold text-gray-900 dark:text-white">
          Create Support Ticket
        </h1>
      </div>

      <div class="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
        <form [formGroup]="ticketForm" autocomplete="off">
          <div class="mb-6">
            <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" i18n="@@TICKET_TITLE_LABEL">
              Title
            </label>
            <input type="text" id="title" formControlName="title" class="w-full" i18n-placeholder="@@TICKET_TITLE_PLACEHOLDER" placeholder="Enter a descriptive title" />
            @if (ticketForm.get('title')?.invalid && (ticketForm.get('title')?.dirty || ticketForm.get('title')?.touched)) {
              <p class="mt-2 text-sm text-red-600 dark:text-red-400" i18n="@@TITLE_REQUIRED">
                Title is required
              </p>
            }
          </div>

          <div class="mb-6">
            <label for="body" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" i18n="@@TICKET_BODY_LABEL">
              Description (Markdown supported)
            </label>
            <textarea id="body" formControlName="body" rows="10" class="w-full" i18n-placeholder="@@TICKET_BODY_PLACEHOLDER" placeholder="Describe your issue in detail. You can use Markdown for formatting." ></textarea>
            @if (ticketForm.get('body')?.invalid && (ticketForm.get('body')?.dirty || ticketForm.get('body')?.touched)) {
              <p class="mt-2 text-sm text-red-600 dark:text-red-400" i18n="@@BODY_REQUIRED">
                Description is required
              </p>
            }
          </div>

          <div class="bg-gray-50 dark:bg-dark-700 p-4 rounded-md mb-6">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" i18n="@@MARKDOWN_GUIDE_TITLE">
              Markdown Guide
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <p class="font-medium text-gray-700 dark:text-gray-300" i18n="@@MARKDOWN_BASICS">Basics</p>
                <ul class="text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                  <li><code class="bg-gray-100 dark:bg-dark-600 px-1 rounded">**bold**</code> - <span i18n="@@MARKDOWN_BOLD">Bold text</span></li>
                  <li><code class="bg-gray-100 dark:bg-dark-600 px-1 rounded">*italic*</code> - <span i18n="@@MARKDOWN_ITALIC">Italic text</span></li>
                  <li><code class="bg-gray-100 dark:bg-dark-600 px-1 rounded">[link](http://example.com)</code> - <span i18n="@@MARKDOWN_LINK">Link</span></li>
                </ul>
              </div>
              <div>
                <p class="font-medium text-gray-700 dark:text-gray-300" i18n="@@MARKDOWN_LISTS">Lists</p>
                <ul class="text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                  <li><code class="bg-gray-100 dark:bg-dark-600 px-1 rounded">- item</code> - <span i18n="@@MARKDOWN_BULLETS">Bullet points</span></li>
                  <li><code class="bg-gray-100 dark:bg-dark-600 px-1 rounded">1. item</code> - <span i18n="@@MARKDOWN_NUMBERS">Numbered lists</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button type="button" routerLink="/support" class="button stroke-primary mr-4" i18n="@@CANCEL_BUTTON">
              Cancel
            </button>
            <button type="button" (click)="onSubmit('Bug')" [disabled]="ticketForm.invalid || isSubmitting()" class="button flat-warning mr-4 min-w-[140px] flex items-center justify-center" i18n="@@SUBMIT_TICKET_BUTTON">
              @if (isSubmitting()) {
                <svg class="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              }
              <span>Submit Bug</span>
            </button>
            <button type="button" (click)="onSubmit('Feature')" [disabled]="ticketForm.invalid || isSubmitting()" class="button flat-primary min-w-[140px] flex items-center justify-center" i18n="@@SUBMIT_TICKET_BUTTON">
              @if (isSubmitting()) {
                <svg class="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              }
              <span>Submit Feature</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  providers: [SupportService]
})
export class CreateIssueComponent {
  private readonly fb = inject(FormBuilder);
  private readonly supportService = inject(SupportService);
  private readonly router = inject(Router);

  protected readonly ticketForm: FormGroup;
  protected readonly isSubmitting = signal(false);

  constructor() {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      body: ['', [Validators.required]]
    });
  }

  protected onSubmit(type: 'Bug' | 'Feature'): void {
    if (this.ticketForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);

    const issueData: CreateIssue = {
      title: this.ticketForm.value.title,
      body: this.ticketForm.value.body,
      type
    };

    this.supportService.createIssue(issueData).pipe(
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
      next: (issue) => {
        if (issue) {
          this.router.navigate(['/support'], { 
            queryParams: { 
              refresh: new Date().getTime() 
            }
          });
        }
      },
      error: (error) => {
        console.error('Failed to create issue:', error);
      }
    });
  }
} 