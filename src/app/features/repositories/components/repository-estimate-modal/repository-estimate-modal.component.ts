import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProviderLogoComponent } from '../../../../shared/components/provider-logo/provider-logo.component';
import { Repository } from '../../../../shared/models/repository.model';
import { BranchSelectorComponent } from '../branch-selector/branch-selector.component';
import { ExtSelectorComponent } from '../ext-selector/ext-selector.component';
import { TransUnitStateSelectorComponent } from '../trans-unit-state-selector/trans-unit-state-selector.component';

import { RepositoryService } from '../../services/repository.service';

@Component({
  selector: 'app-repository-estimate-modal',
  templateUrl: './repository-estimate-modal.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BranchSelectorComponent,
    ExtSelectorComponent,
    TransUnitStateSelectorComponent,
    ProviderLogoComponent
  ],
  styles: [
    `
    label {
      @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
    }
    `
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RepositoryEstimateModalComponent {
  repository = input.required<Repository>();
  repositoryService = inject(RepositoryService);
  closeModal = output<{branch: string, ext: string, transUnitState: string} | null>();
  branches = signal<string[]>([]);

  actionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.actionForm = this.fb.group({
      branch: ['', Validators.required],
      transUnitState: ['all', Validators.required],
      ext: ['xlf', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.actionForm.valid) {
      const { branch, ext, transUnitState } = this.actionForm.getRawValue();
      this.closeModal.emit({ branch, ext, transUnitState });
    }
  }
} 