import { AbstractControl } from '@angular/forms';

export function ValidateWhitespace(control: AbstractControl) {
  const hasValue = !!control.value?.trim();

  return hasValue ? null : { required: true };
}
