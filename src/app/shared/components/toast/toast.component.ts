import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Toast, ToastService } from '../../../core/services/toast.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 space-y-2">
      @for (toast of toasts$ | async; track toast.id) {
        <div class="min-w-[300px] p-4 rounded-lg shadow-lg flex items-start gap-2" [class]="getToastClasses(toast.level)">
          <div class="flex-1">
            <p class="text-sm">{{ toast.message }}</p>
          </div>
          @if (toast.actions?.length) {
            <div class="flex gap-2">
              @for (action of toast.actions; track action.value) {
                <button (click)="handleAction(toast, action.value)" class="text-sm font-medium hover:opacity-80">
                  {{ action.label }}
                </button>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  private toastService = inject(ToastService);
  toasts$: Observable<Toast[]> = this.toastService.toasts$;

  getToastClasses(level: Toast['level']): string {
    const baseClasses = 'bg-light-surface dark:bg-dark-800 border';
    
    switch (level) {
      case 'warning':
        return `${baseClasses} border-yellow-500 text-yellow-700 dark:text-yellow-300`;
      case 'error':
        return `${baseClasses} border-red-500 text-red-700 dark:text-red-300`;
      default:
        return `${baseClasses} border-primary text-primary`;
    }
  }

  handleAction(toast: Toast, value: string): void {
    this.toastService.dismiss(toast.id, value);
  }
} 