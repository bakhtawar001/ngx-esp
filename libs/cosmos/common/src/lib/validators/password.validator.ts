import {
  AbstractControl,
  FormArray,
  FormGroup,
  Validators,
  ValidationErrors,
} from '@angular/forms';

export interface ValidationResult {
  [key: string]: boolean;
}

export function containsAlphaNumeric(
  control: AbstractControl
): ValidationErrors | null {
  let hasNumeric = /[0-9]/.test(control.value);
  let hasAlpha = /[a-zA-Z]/.test(control.value);

  const valid = hasNumeric && hasAlpha;

  if (!valid) {
    return { alphaNumeric: true };
  }
  return null;
}

export function matchValues(
  matchTo: string // name of the control to match to
) {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent: FormGroup | FormArray | null = control.parent;
    return parent instanceof FormGroup &&
      !!parent.value &&
      control.value === parent.controls[matchTo].value
      ? null
      : { matches: true };
  };
}

export const passwordValidators = [
  Validators.required,
  Validators.minLength(8),
  Validators.maxLength(64),
  Validators.pattern(/^[a-zA-Z0-9~`!@#$%^&*()_+\-=\[\]{}|,.<>\/?]+$/),
  containsAlphaNumeric,
];
