import { CommonModule } from '@angular/common';
import { Component, forwardRef } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TypedControlValueAccessor } from '../../../../shared/typed-value-control-accessor';

@Component({
  selector: 'app-ext-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ext-selector.component.html',
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
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ExtSelectorComponent), multi: true }
  ]
})
export class ExtSelectorComponent implements TypedControlValueAccessor<string | null> {

  extensions: string[] = ['xlf', 'xliff'];
  extUserFC: FormControl<string | null> = new FormControl<string | null>('xlf');
  extSelectFC: FormControl<string | null> = new FormControl<string | null>('xlf');

  constructor() {
    this.extUserFC.valueChanges.subscribe(value => {
      this.extSelectFC.setValue(value);
    });
    this.extSelectFC.valueChanges.subscribe(value => {
      this.extUserFC.setValue(value, { emitEvent: false });
    });
  }

  writeValue(value: string): void {
    this.extUserFC.setValue(value);
    this.extSelectFC.setValue(value);
  } 

  registerOnChange(fn: (value: string | null) => void): void {
    this.extSelectFC.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: (value: string | null) => void): void {
    this.extSelectFC.valueChanges.subscribe(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.extUserFC.disable();
      this.extSelectFC.disable();
    } else {
      this.extUserFC.enable();
      this.extSelectFC.enable();
    }
  }
}