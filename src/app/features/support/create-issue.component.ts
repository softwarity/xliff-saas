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
        <form [formGroup]="ticketForm" (ngSubmit)="onSubmit()">
          <div class="mb-6">
            <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" i18n="@@TICKET_TITLE_LABEL">
              Title
            </label>
            <input
              type="text"
              id="title"
              formControlName="title"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
              i18n-placeholder="@@TICKET_TITLE_PLACEHOLDER"
              placeholder="Enter a descriptive title"
            />
            @if (ticketForm.get('title')?.invalid && (ticketForm.get('title')?.dirty || ticketForm.get('title')?.touched)) {
              <p class="mt-2 text-sm text-red-600 dark:text-red-400" i18n="@@TITLE_REQUIRED">
                Title is required
              </p>
            }
          </div>

          <div class="mb-6">
            <span class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" i18n="@@TICKET_TYPE_LABEL">
              Ticket Type
            </span>
            <div class="flex gap-4">
              <div class="flex items-center">
                <input 
                  type="radio" 
                  id="type-bug" 
                  value="Bug"
                  formControlName="type"
                  class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 dark:border-gray-600"
                />
                <label for="type-bug" class="ml-2 flex items-center">
                  <span class="badge bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" i18n="@@TICKET_TYPE_BUG_LABEL">Bug</span>
                </label>
              </div>
              
              <div class="flex items-center">
                <input 
                  type="radio" 
                  id="type-feature" 
                  value="Feature"
                  formControlName="type"
                  class="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
                />
                <label for="type-feature" class="ml-2 flex items-center">
                  <span class="badge bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300" i18n="@@TICKET_TYPE_FEATURE_LABEL">Feature</span>
                </label>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <label for="body" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" i18n="@@TICKET_BODY_LABEL">
              Description (Markdown supported)
            </label>
            <textarea
              id="body"
              formControlName="body"
              rows="10"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-dark-900 text-gray-900 dark:text-white font-mono"
              i18n-placeholder="@@TICKET_BODY_PLACEHOLDER"
              placeholder="Describe your issue in detail. You can use Markdown for formatting."
            ></textarea>
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
            <button 
              type="submit" 
              [disabled]="ticketForm.invalid || isSubmitting()" 
              class="button flat-primary min-w-[140px] flex items-center justify-center" 
              i18n="@@SUBMIT_TICKET_BUTTON"
            >
              @if (isSubmitting()) {
                <svg class="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              }
              <span>Submit Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  providers: [SupportService],
  styles: [`
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
export class CreateIssueComponent {
  private readonly fb = inject(FormBuilder);
  private readonly supportService = inject(SupportService);
  private readonly router = inject(Router);

  protected readonly ticketForm: FormGroup;
  protected readonly isSubmitting = signal(false);

  constructor() {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      type: ['Bug', [Validators.required]],  // Bug par défaut
      body: ['', [Validators.required]]
    });
  }

  protected onSubmit(): void {
    if (this.ticketForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    
    const issueData: CreateIssue = {
      title: this.ticketForm.value.title,
      body: this.ticketForm.value.body,
      type: this.ticketForm.value.type
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