import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Repository } from '../../../shared/models/repository.model';
import { ProviderType } from '../../models/provider-type';
import '../../../web-components/icon';

export type AIScope = 'global' | 'provider' | 'repository';

export interface AIInstructionsModalData {
  scope: AIScope;
  provider?: ProviderType;
  repository?: Pick<Repository, 'name' | 'namespace' | 'provider'>;
  instructions: string;
}

@Component({
  selector: 'app-ai-instructions-modal',
  standalone: true,
  imports: [
    CommonModule,
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './ai-instructions-modal.component.html'
})
export class AIInstructionsModalComponent {
  data = input.required<AIInstructionsModalData>();
  closeModal = output<{instructions: string} | null>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      instructions: ['', Validators.required]
    });
  }

  get modalTitle(): string {
    const { scope, provider, repository } = this.data();
    switch (scope) {
      case 'global':
        return $localize`:@@GLOBAL_AI_INSTRUCTIONS_TITLE:Global AI Instructions`;
      case 'provider':
        return $localize`:@@PROVIDER_AI_INSTRUCTIONS_TITLE:AI Instructions for ${provider}`;
      case 'repository':
        return $localize`:@@REPOSITORY_AI_INSTRUCTIONS_TITLE:AI Instructions for ${repository?.name}`;
      default:
        return $localize`:@@AI_INSTRUCTIONS_TITLE:AI Instructions`;
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { instructions } = this.form.getRawValue();
      this.closeModal.emit({ instructions });
    }
  }

  onCancel(): void {
    this.closeModal.emit(null);
  }
} 