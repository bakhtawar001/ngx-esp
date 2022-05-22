import { Observable } from 'rxjs';
import { NgControl } from '@angular/forms';
import { Directive } from '@angular/core';

@Directive()
export abstract class CosFormFieldControlDirective<T> {
  readonly id!: string;

  /**
   * Stream that emits whenever the state of the control changes such that the parent `CosFormField`
   * needs to run change detection.
   */
  readonly stateChanges!: Observable<void>;

  /** Gets the NgControl for this control. */
  readonly ngControl!: NgControl | null;

  readonly placeholder?: string;

  readonly focused!: boolean;

  readonly empty!: boolean;

  readonly required!: boolean;

  readonly disabled!: boolean;

  readonly errorState!: boolean;

  readonly controlType?: string;

  readonly autofilled?: boolean;

  /** Used for setting the IDs of elements that provide additonal descriptions for the control, for accessibility */
  abstract setDescribedByIds(ids: string[]): void;

  abstract onContainerClick(event: MouseEvent): void;
}
