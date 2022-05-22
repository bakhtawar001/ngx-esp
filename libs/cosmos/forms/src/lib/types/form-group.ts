import { AbstractControl as NgAbstractControl } from '@angular/forms';
import { AbstractControl } from './abstract-control';

export interface FormGroup<T extends Record<string, any> = any>
  extends AbstractControl<T> {
  controls: {
    [key in keyof T]: AbstractControl<T[key], T>;
  };

  addControl<K extends keyof T>(
    name: Extract<keyof T, string>,
    control: NgAbstractControl | AbstractControl<T[K]>,
    options?: {
      emitEvent?: boolean;
    }
  ): void;

  contains(controlName: keyof T): boolean;

  getRawValue(): T;

  patchValue(
    value: Partial<T>,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void;

  registerControl<K extends keyof T>(
    name: Extract<keyof T, string>,
    control: NgAbstractControl | AbstractControl<T[K]>
  ): NgAbstractControl;

  removeControl(
    name: keyof T,
    options?: {
      emitEvent?: boolean;
    }
  ): void;

  reset(
    value?: T,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void;

  setControl<K extends keyof T>(
    name: Extract<keyof T, string>,
    control: NgAbstractControl | AbstractControl<T[K]>,
    options?: {
      emitEvent?: boolean;
    }
  ): void;

  setValue<K extends keyof T>(
    value: T,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void;
}
