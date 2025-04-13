import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupportService } from './support.service';

@Component({
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 i18n="@@SUPPORT_TITLE" class="text-2xl font-bold text-gray-900 dark:text-white">
          Support Tickets
        </h1>
        <div class="flex items-center gap-4">
          <button (click)="refreshIssues()" class="button stroke-primary" [disabled]="isLoading()" i18n="@@REFRESH_TICKETS">
            <svg [class.animate-spin]="isLoading()" class="h-5 w-5"  xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 20 20"  fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
          </button>
          <a routerLink="/support/create" class="button flat-primary" i18n="@@CREATE_NEW_TICKET">
            Create New Ticket
          </a>
        </div>
      </div>

      <div class="bg-white dark:bg-dark-800 rounded-lg shadow-md">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th i18n="@@TICKET_NUMBER" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ticket Number
                </th>
                <th i18n="@@TICKET_TITLE" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th i18n="@@TICKET_STATUS" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th i18n="@@TICKET_CREATED_AT" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created At
                </th>
                <th i18n="@@TICKET_ACTIONS" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-gray-700">
              @for (issue of issues(); track issue.id) {
                <tr class="hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    #{{ issue.number }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ issue.title }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      [class]="issue.state === 'open' 
                        ? 'badge bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'badge bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'"
                      i18n="@@TICKET_STATE"
                    >
                      {issue.state, select, open {Open} closed {Closed}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ issue.created_at | date:'medium' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <a 
                      [routerLink]="['/support', issue.number]"
                      class="text-primary hover:text-primary-hover"
                      i18n="@@VIEW_TICKET"
                    >
                      View
                    </a>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400" i18n="@@NO_TICKETS_FOUND">
                    No tickets found
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (totalPages() > 1) {
          <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div class="flex-1 flex justify-between sm:hidden">
              <button 
                (click)="previousPage()"
                [disabled]="currentPage() === 1"
                class="button stroke-primary"
                i18n="@@PREVIOUS_PAGE"
              >
                Previous
              </button>
              <button 
                (click)="nextPage()"
                [disabled]="currentPage() === totalPages()"
                class="button stroke-primary"
                i18n="@@NEXT_PAGE"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-300" i18n="@@PAGE_INFO">Page {{ currentPage() }} of {{ totalPages() }}</p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button 
                    (click)="previousPage()"
                    [disabled]="currentPage() === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700"
                  >
                    <span class="sr-only" i18n="@@PREVIOUS_PAGE_SR">Previous</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  @for (page of pages(); track page) {
                    <button 
                      (click)="goToPage(page)"
                      [class]="page === currentPage() 
                        ? 'z-10 bg-primary border-primary text-white relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                        : 'bg-white dark:bg-dark-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium'"
                    >
                      {{ page }}
                    </button>
                  }
                  <button 
                    (click)="nextPage()"
                    [disabled]="currentPage() === totalPages()"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700"
                  >
                    <span class="sr-only" i18n="@@NEXT_PAGE_SR">Next</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [SupportService]
})
export class SupportComponent {
  private readonly supportService = inject(SupportService);
  private readonly pageSize = 10;

  protected readonly issues = signal<Issue[]>([]);
  protected readonly currentPage = signal(1);
  protected readonly totalIssues = signal(0);
  protected readonly totalPages = signal(0);
  protected readonly pages = signal<number[]>([]);
  protected readonly isLoading = signal(false);

  constructor() {
    this.loadIssues();
  }

  private loadIssues(): void {
    this.isLoading.set(true);
    this.supportService.getIssues(this.currentPage(), this.pageSize).subscribe({
      next: (response) => {
        this.issues.set(response.data);
        this.totalIssues.set(response.count);
        this.totalPages.set(Math.ceil(response.count / this.pageSize));
        this.pages.set(Array.from({ length: this.totalPages() }, (_, i) => i + 1));
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load issues:', error);
        this.isLoading.set(false);
      }
    });
  }

  protected refreshIssues(): void {
    this.loadIssues();
  }

  protected nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadIssues();
    }
  }

  protected previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadIssues();
    }
  }

  protected goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadIssues();
  }
}
