import { AbstractControl } from '@angular/forms';

const EMAIL_REGEXP = /^([a-zA-Z0-9-!#$%&'*+-/=?^_`{|}.~]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

export function ValidateEmail(control: AbstractControl) {
  if (control.value?.length && !EMAIL_REGEXP.test(control.value)) {
    return { email: true };
  }

  return null;
}
