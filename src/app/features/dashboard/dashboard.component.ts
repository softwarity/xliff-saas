import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  styles: [
    `
    label {
      @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
    }
    textarea {
      @apply w-full border rounded-lg px-4 py-2;
      @apply bg-white border border-gray-300;
      @apply disabled:opacity-50 disabled:cursor-not-allowed;
      @apply focus:outline-none focus:ring-2 focus:ring-primary;
      @apply dark:bg-dark-800 dark:border-gray-600 dark:text-white;
      min-height: 150px;
    }
    `
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  private auth = inject(AuthService);
  user = toSignal(this.auth.user$);

  instructionForm = new FormGroup({
    instructions: new FormControl('', [Validators.required])
  });

  onSubmit() {
    console.log(this.instructionForm.value);
  }
}