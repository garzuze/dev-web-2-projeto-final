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
  @HostListener('keyup', ['$event'])
  onKeyUp($event: any) {
    let value = $event.target.value;
    value = value.replace('/[\D]g', '');

    this.onChange(value);
  }

  onChange = (fn: any) => {};
  onTouched = () => {};
}
