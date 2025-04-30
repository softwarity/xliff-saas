import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RepositoryService } from '../../../../../core/services/repository.service';
import { Repository } from '../../../../../shared/models/repository.model';
import { BranchSelectorComponent } from '../../branch-selector/branch-selector.component';
import { ExtSelectorComponent } from '../../ext-selector/ext-selector.component';
import { TransUnitStateSelectorComponent } from '../../trans-unit-state-selector/trans-unit-state-selector.component';

@Component({
  selector: 'app-translate-modal',
  templateUrl: './translate-modal.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BranchSelectorComponent,
    ExtSelectorComponent,
    TransUnitStateSelectorComponent
  ]
})
export class TranslateModalComponent {
  repository = input.required<Repository>();
  repositoryService = inject(RepositoryService);
  closeModal = output<{branch: string, ext: string, transUnitState: string, procedeedTransUnitState: string} | null>();
  branches = signal<string[]>([]);

  actionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.actionForm = this.fb.group({
      branch: ['', Validators.required],
      transUnitState: ['new', Validators.required],
      procedeedTransUnitState: ['translated', Validators.required],
      ext: ['xlf', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.actionForm.valid) {
      const { branch, ext, transUnitState, procedeedTransUnitState } = this.actionForm.getRawValue();
      this.closeModal.emit({ branch, ext, transUnitState, procedeedTransUnitState });
    }
  }
} 