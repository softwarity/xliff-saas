import { CommonModule } from '@angular/common';
import { Component, effect, forwardRef, input, signal } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TypedControlValueAccessor } from '../../../../shared/typed-value-control-accessor';

@Component({
  selector: 'app-trans-unit-state-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './trans-unit-state-selector.component.html',
  styles: [
    `
      :host {
        display: block;
        position: relative;
        @apply w-full;
      }
      select {
        @apply w-full border rounded-lg px-4 py-2 appearance-none cursor-pointer;
        @apply bg-white border border-gray-300;
        @apply disabled:opacity-50 disabled:cursor-not-allowed;
        @apply focus:outline-none focus:ring-2 focus:ring-primary;
        @apply dark:bg-dark-800 dark:border-gray-600 dark:text-white;
      }
      input {
        @apply appearance-none cursor-pointer;
        @apply top-[1px] absolute left-[1px] right-10 border-none;
        width: unset;
      }
      svg {
        @apply absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 pointer-events-none;
      }
      `
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TransUnitStateSelectorComponent), multi: true }
  ]
})
export class TransUnitStateSelectorComponent implements TypedControlValueAccessor<string | null> {
  additionalTransUnitStates = input<string[]>([]);
  baseStates: string[] = ['new', 'translated', 'needs-adaptation', 'needs-l10n', 'needs-review-adaptation', 'needs-review-l10n', 'needs-review-translation', 'need-translation', 'signed-off', 'final'];
  transUnitStates = signal<string[]>([]);
// - `new`: The segment is new and has not yet been processed for translation.
// - `translated`: The segment has been translated but may still require review or adaptation. The translation is complete but not yet finalized.
// - `needs-adaptation`: The translation requires adaptations to better fit the context or specific project needs.
// - `needs-l10n`: The translation needs localization adjustments to ensure cultural and contextual appropriateness for the target audience.
// - `needs-review-adaptation`: The translation requires review and adaptations. A reviewer should examine the text and make necessary changes.
// - `needs-review-l10n`: The translation needs a review concerning localization. It should be checked for cultural relevance and appropriateness.
// - `needs-review-translation`: The translation requires a general review to ensure correctness and appropriateness.
// - `need-translation`: The segment has not yet been translated and requires translation.
// - `signed-off`: The translation has been approved and signed off by a responsible party or reviewer, indicating it is finalized.
// - `final`: The translation is complete and ready for use. No further changes are expected.

  transUnitStateSelectFC: FormControl<string | null> = new FormControl<string | null>('all');

  constructor() {
    effect(() => {
      this.transUnitStates.set([...this.additionalTransUnitStates(), ...this.baseStates]);
    });
  }

  writeValue(value: string): void {
    this.transUnitStateSelectFC.setValue(value);
  } 

  registerOnChange(fn: (value: string | null) => void): void {
    this.transUnitStateSelectFC.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: (value: string | null) => void): void {
    this.transUnitStateSelectFC.valueChanges.subscribe(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.transUnitStateSelectFC.disable();
    } else {
      this.transUnitStateSelectFC.enable();
    }
  }
}