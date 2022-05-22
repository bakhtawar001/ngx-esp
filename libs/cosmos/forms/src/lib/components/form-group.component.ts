import {
  AfterViewInit,
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
import { ReplaySubject } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup } from '../types';
import { dynamicFormGroup } from '../utils';

const OnInitSubject = Symbol('OnInitSubject');

@Directive()
export abstract class FormGroupComponent<T extends object = any>
  implements OnInit, AfterViewInit
{
  protected readonly _fb: FormBuilder;
  protected readonly _parent?: ControlContainer;

  private [OnInitSubject] = new ReplaySubject<true>(1);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('formGroup')
  form!: FormGroup<T>;

  @Input()
  formGroupName?: string | number;

  constructor() {
    this._fb = inject(FormBuilder);
    this._parent = inject(
      ControlContainer,
      InjectFlags.Host | InjectFlags.Optional | InjectFlags.SkipSelf
    );

    this.onFormInit$.subscribe(() => this.initForm());
  }

  public get onFormInit$() {
    return this[OnInitSubject].asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit() {
    this._initForm();
  }

  ngAfterViewInit() {
    this[OnInitSubject].next(true);
    this[OnInitSubject].complete();
  }

  getFormArray<K extends keyof T>(
    prop: K
  ): FormArray<T[K] extends any[] ? T[K][number] : never> {
    return this.form.get(prop as string) as any;
  }

  getFormGroup<K extends keyof T>(prop: K): FormGroup<T[K]> {
    return this.form.get(prop as string) as any;
  }

  getFormControl<K extends keyof T>(prop: K): FormControl<T[K]> {
    return this.form.get(prop as string) as any;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _initForm() {
    if (this.form) return;

    this.form = dynamicFormGroup(this.createForm()) as any;

    const parentForm = this._parent?.control;

    if (
      parentForm instanceof NgFormArray &&
      typeof this.formGroupName === 'number'
    ) {
      if (parentForm.controls[this.formGroupName]) {
        this.form = parentForm.get([this.formGroupName]) as FormGroup<T>;
      } else {
        parentForm.insert(this.formGroupName, this.form);
      }
    } else if (
      parentForm instanceof NgFormGroup &&
      typeof this.formGroupName === 'string' &&
      this.formGroupName
    ) {
      if (parentForm.contains(this.formGroupName)) {
        this.form = parentForm.get(this.formGroupName) as FormGroup<T>;
      } else {
        parentForm.addControl(this.formGroupName, this.form);
      }
    }
  }

  protected createForm() {
    return this._fb.group<any>({});
  }

  protected initForm(): void {}
}
