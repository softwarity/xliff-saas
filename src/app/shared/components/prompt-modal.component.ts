import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-prompt-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <form class="modal" [formGroup]="form" (ngSubmit)="submit()" (click)="$event.stopPropagation()" autocomplete="off">
        <div class="modal-header">
          <h2 class="modal-title">{{ title() }}</h2>
          <p class="modal-description">{{ description() }}</p>
        </div>
        <div class="modal-container">
          <input name="prompt-input" id="prompt-input" type="text" class="w-full" formControlName="prompt" [placeholder]="placeholder()">
        </div>
        <div class="modal-actions">
          <button type="button" class="flat-secondary" (click)="close()" i18n="@@MODAL_CANCEL">Cancel</button>
          <button type="submit" class="flat-primary" [disabled]="form.invalid" i18n="@@MODAL_CONFIRM">Confirm</button>
        </div>
      </form>
    </div>
  `
})
export class PromptModalComponent {
  title = input.required<string>();
  description = input.required<string>();
  placeholder = input<string>($localize`:@@ENTER_TEXT_PROMPT:Enter text...`);
  closed = output<string | null>();

  form = new FormGroup({
    prompt: new FormControl('', [Validators.required])
  });
  
  submit() {
    if (this.form.valid) {
      this.closed.emit(this.form.value.prompt || '');
    }
  }

  close() {
    this.closed.emit(null);
  }
}
