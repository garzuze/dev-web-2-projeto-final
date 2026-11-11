import { Directive, HostListener } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appNumerico]',
})
export class Numeric implements ControlValueAccessor{
  writeValue(value: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  @HostListener('keydown', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    const isNumber = /^[0-9]$/.test(event.key);

    if (!isNumber) {
      event.preventDefault();
    }

  }

  onChange = (fn: any) => {};
  onTouched = () => {};
}
