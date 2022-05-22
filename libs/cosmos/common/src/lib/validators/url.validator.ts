import { AbstractControl } from '@angular/forms';

export function ValidateUrl(control: AbstractControl) {
  const URL_REGEXP = /^(https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|[^\s]+\.[^\s]{2,})$/;

  if (control.value?.length && !URL_REGEXP.test(control.value)) {
    return { validUrl: true };
  }

  return null;
}
