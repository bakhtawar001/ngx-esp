import {
  Directive,
  InjectFlags,
  Input,
  OnInit,
  ɵɵdirectiveInject as inject,
} from '@angular/core';
import {
  ControlContainer,
  FormArray as NgFormArray,
  FormGroup as NgFormGroup,
} from '@angular/forms';
import { FormBuilder, FormControl } from '../types';

@Directive()
export abstract class FormControlComponent<T = any> implements OnInit {
  protected readonly _fb: FormBuilder;
  protected readonly _parent?: ControlContainer;

  @Input('formControl')
  control!: FormControl<T>;

  @Input()
  formControlName?: string | number;

  constructor() {
    this._fb = inject(FormBuilder);
    this._parent = inject(
      ControlContainer,
      InjectFlags.Host | InjectFlags.Optional | InjectFlags.SkipSelf
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit() {
    this._initForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _initForm() {
    if (this.control) return;

    this.control = this.createForm();

    const parentForm = this._parent?.control;

    if (
      parentForm instanceof NgFormArray &&
      typeof this.formControlName === 'number'
    ) {
      if (parentForm.controls[this.formControlName]) {
        this.control = parentForm.get([this.formControlName]) as FormControl<T>;
      } else {
        parentForm.insert(this.formControlName, this.control);
      }
    } else if (
      parentForm instanceof NgFormGroup &&
      typeof this.formControlName === 'string' &&
      this.formControlName
    ) {
      if (parentForm.contains(this.formControlName)) {
        this.control = parentForm.get(this.formControlName) as FormControl<T>;
      } else {
        parentForm.addControl(this.formControlName, this.control);
      }
    }
  }

  protected createForm() {
    return this._fb.control<T>(null);
  }
}
