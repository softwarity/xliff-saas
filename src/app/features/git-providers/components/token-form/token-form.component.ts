import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GitProvider } from '../../../../core/services/git-provider.service';

@Component({
  selector: 'app-token-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './token-form.component.html'
})
export class TokenFormComponent {
  provider = input.required<GitProvider>();
  form = input.required<FormGroup>();
  showInput = input.required<boolean>();

  connect = output<void>();
  disconnect = output<void>();
  updateToken = output<boolean>();

  onSubmit(): void {
    if (this.form().valid) {
      this.connect.emit();
    }
  }

  onDisconnect(): void {
    this.disconnect.emit();
  }

  onUpdateToken(show: boolean): void {
    this.updateToken.emit(show);
  }
}