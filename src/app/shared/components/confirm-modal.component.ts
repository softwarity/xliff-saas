import { Component, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="closed.emit(false)">
      <form class="modal" (click)="$event.stopPropagation()" autocomplete="off">
        <div class="modal-header">
          <h2 class="modal-title">{{ title() }}</h2>
          <p class="modal-description">{{ description() }}</p>
          @if (warning()) {
            <div class="modal-warning">
              <svg xmlns="http://www.w3.org/2000/svg" class="warning-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>{{ warning() }}</p>
            </div>
          }
        </div>
        <div class="modal-actions">
          <button type="button" class="flat-secondary" (click)="closed.emit(false)" i18n="@@MODAL_CANCEL">Cancel</button>
          <button type="button" class="flat-primary" (click)="closed.emit(true)" i18n="@@MODAL_CONFIRM">Confirm</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .modal-warning {
      margin-top: 0.75rem;
      padding: 0.75rem;
      border-radius: 0.375rem;
      background-color: rgba(220, 38, 38, 0.1);
      color: rgb(185, 28, 28);
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    /* Styles améliorés pour le mode sombre */
    :host-context(.dark) .modal-warning {
      background-color: rgba(248, 113, 113, 0.15);
      color: rgb(248, 113, 113);
    }
    
    .warning-icon {
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }
    
    .modal-warning p {
      margin: 0;
      font-size: 0.875rem;
    }
    
    .modal-instructions {
      margin: 0 0 1rem 0;
      font-size: 0.875rem;
      color: rgb(107, 114, 128);
    }
    
    :host-context(.dark) .modal-instructions {
      color: rgb(156, 163, 175);
    }
  `]
})
export class ConfirmModalComponent {
  title = input.required<string>();
  description = input.required<string>();
  warning = input<string>('');
  closed = output<boolean>();
}
