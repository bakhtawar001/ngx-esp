import {
  ChangeDetectorRef,
  ContentChild,
  Directive,
  InjectFlags,
  Input,
  OnInit,
  TemplateRef,
  ɵmarkDirty as markDirty,
  ɵɵdirectiveInject as inject,
} from '@angular/core';
import { ControlContainer, FormGroup as NgFormGroup } from '@angular/forms';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '../types';
import { dynamicFormArray } from '../utils';

@Directive()
export abstract class FormArrayComponent<T extends Record<string, any> = any>
  implements OnInit
{
  protected readonly _cdRef: ChangeDetectorRef;
  protected readonly _fb: FormBuilder;
  protected readonly _parent?: ControlContainer;

  form!: FormArray<T>;

  @Input()
  formArrayName?: string;

  @ContentChild(TemplateRef) public template?: TemplateRef<any>;

  constructor() {
    this._cdRef = inject(ChangeDetectorRef);
    this._fb = inject(FormBuilder);
    this._parent = inject(
      ControlContainer,
      InjectFlags.Host | InjectFlags.Optional | InjectFlags.SkipSelf
    );
  }

  get controls() {
    return this.form.controls as unknown as FormControl<T>[];
  }

  get groups() {
    return this.form.controls as unknown as FormGroup<T>[];
  }

  get parentForm() {
    return this._parent?.control as NgFormGroup;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this._initForm();
  }

  addItem(value?: T) {
    const control = this.createArrayControl();

    if (typeof value !== 'undefined') {
      control.patchValue(value);
    }

    this.form.push(control);

    markDirty(this);
  }

  removeItem(item: AbstractControl<T>) {
    const i = this.form.controls.indexOf(item);

    if (i >= 0) {
      this.form.removeAt(i);

      // TODO: revisit with angular 12
      this.form.markAsDirty();
      this.form.updateValueAndValidity();
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private createArrayControlWithCheck() {
    this._cdRef.markForCheck();
    return this.createArrayControl();
  }

  private _initForm() {
    if (this.form) return;
    this.form = dynamicFormArray(
      this.createForm(),
      this.createArrayControlWithCheck.bind(this)
    ) as any;

    if (this.formArrayName) {
      if (this.parentForm.contains(this.formArrayName)) {
        this.form = this.parentForm.get(this.formArrayName) as FormArray<T>;

        // this.form = dynamicFormArray(
        //   this.parentForm.get(this.formArrayName) as FormArray<T>,
        //   this.createArrayControl.bind(this)
        // );

        // this.parentForm.setControl(this.formArrayName, this.form);
      } else {
        this.parentForm.addControl(this.formArrayName, this.form);
      }
    }
    this.initForm();
  }

  protected abstract createArrayControl(): AbstractControl<T>;

  protected createForm() {
    return this._fb.array<T>([]);
  }

  protected initForm(): void {}
}
