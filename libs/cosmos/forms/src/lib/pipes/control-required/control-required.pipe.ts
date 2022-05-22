import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'controlRequired',
})
export class ControlRequiredPipe implements PipeTransform {
  public transform(control: AbstractControl): boolean {
    //  Return the required state of the validator
    if (control?.validator) {
      const validator = control.validator({} as AbstractControl);
      return validator && validator.required;
    }

    return false;
  }
}

@NgModule({
  declarations: [ControlRequiredPipe],
  exports: [ControlRequiredPipe],
})
export class ControlRequiredPipeModule {}
