import { ControlValueAccessor } from "@angular/forms";

export interface TypedControlValueAccessor<T> extends ControlValueAccessor {
  writeValue(value: T): void;
  registerOnChange(fn: (value: T) => void): void;
  registerOnTouched(fn: (value: T) => void): void;
  setDisabledState?(isDisabled: boolean): void;
}