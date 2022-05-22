import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { getSupportedInputTypes } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import {
  Directive,
  DoCheck,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { UniqueIdService } from '@cosmos/core';
import { Subject } from 'rxjs';
import {
  CanUpdateErrorState,
  CanUpdateErrorStateCtor,
  mixinErrorState,
  ErrorStateMatcher,
} from '@cosmos/components/core';
import { CosFormFieldControlDirective } from '@cosmos/components/form-field';
import { COS_INPUT_VALUE_ACCESSOR } from './input-value-accessor';

const COS_INPUT_INVALID_TYPES = [
  'button',
  'checkbox',
  'file',
  'hidden',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
];

// Boilerplate for applying mixins to MatInput.
/** @docs-private */
class CosInputBase {
  constructor(
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    /** @docs-private */
    public ngControl: NgControl
  ) {}
}
const _CosInputMixinBase: CanUpdateErrorStateCtor & typeof CosInputBase =
  mixinErrorState(CosInputBase);

// eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
@Directive({
  selector:
    'input[cos-input], textarea[cos-input], select[matNativeControl], mat-select',
  providers: [
    { provide: CosFormFieldControlDirective, useExisting: CosInputDirective },
    UniqueIdService,
  ],
})
export class CosInputDirective
  extends _CosInputMixinBase
  implements
    CosFormFieldControlDirective<any>,
    OnChanges,
    OnDestroy,
    OnInit,
    DoCheck,
    CanUpdateErrorState
{
  // Allow Input type coercion
  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_readonly: BooleanInput;
  static ngAcceptInputType_required: BooleanInput;

  // Accept `any` to avoid conflicts with other directives on `<input>` that may
  // accept different types.
  static ngAcceptInputType_value: any;

  protected _uid = `${this._uniqueIdService.getUniqueIdForDom('cos-input')}`;

  protected _previousNativeValue: any;

  protected _neverEmptyInputTypes = [
    'date',
    'datetime',
    'datetime-local',
    'month',
    'time',
    'week',
  ].filter((t) => getSupportedInputTypes().has(t));

  protected _type = 'text';

  /**
   * Implemented as part of CosFormFieldControlDirective.
   */
  override readonly stateChanges: Subject<void> = new Subject<void>();

  private _readonly = false;

  private _inputValueAccessor: { value: any };

  /** Whether the component is a native html select. */
  _isNativeSelect = false;

  /** The aria-describedby attribute on the input for improved a11y. */
  _ariaDescribedby: string | null = null;

  /**
   * Implemented as part of CosFormFieldControlDirective.
   */
  autofilled = false;

  /**
   * Implemented as part of CosFormFieldControlDirective.
   */
  focused = false;

  /**
   * Implemented as part of CosFormFieldControl.
   * @docs-private
   */
  controlType = 'cos-input';

  // -----------------------------------------------------------------------------------------------------
  // @ Inputs
  // -----------------------------------------------------------------------------------------------------

  /** An object used to control when error messages are shown. */
  @Input() override errorStateMatcher!: ErrorStateMatcher;

  /**
   * Implemented as part ofCosFormFieldControl.
   */
  @Input()
  get value(): string {
    return this._inputValueAccessor.value;
  }
  set value(value: string) {
    if (value !== this.value) {
      this._inputValueAccessor.value = value;
      this.stateChanges.next();
    }
  }

  /**
   * Implemented as part of CosFormFieldControlDirective.
   */
  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
  }
  protected _id!: string;

  /**
   * Implemented as part of CosFormFieldControlDirective.
   */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }
  protected _required = false;

  /**
   * Implemented as part of CosFormFieldControlDirective.
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);

    // Browsers may not fire the blur event if the input is disabled too quickly.
    // Reset from here to ensure that the element doesn't become stuck.
    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }
  protected _disabled = false;

  @Input()
  style!: string;

  /** Input type of the element. */
  @Input()
  get type(): string {
    return this._type;
  }
  set type(value: string) {
    this._type = value || 'text';

    /** Make sure the input is a supported type. */
    if (ngDevMode && COS_INPUT_INVALID_TYPES.indexOf(this._type) > -1) {
      throw Error(`Input type "${this._type}" isn't supported by cos-input.`);
    }

    // When using Angular inputs, developers are no longer able to set the properties on the native
    // input element. To ensure that bindings for `type` work, we need to sync the setter
    // with the native property. Textarea elements don't support the type property or attribute.
    if (!this._isTextarea() && getSupportedInputTypes().has(this._type)) {
      (this._elementRef.nativeElement as HTMLInputElement).type = this._type;
    }
  }

  @Input()
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
  }

  @HostBinding('class.cos-input') mainClass = true;

  @HostBinding('class.cos-input--small')
  get isSmall() {
    return this.style === 'small';
  }

  @HostBinding('class.cos-input--large')
  get isLarge() {
    return this.style === 'large';
  }

  @HostBinding('attr.placeholder')
  @Input()
  placeholder?: string;

  @HostBinding('attr.aria-describedby')
  get ariaDescribedBy() {
    return this._ariaDescribedby;
  }

  @HostBinding('attr.aria-required')
  get getAriaRequired() {
    return this.required.toString();
  }

  @HostBinding('attr.aria-invalid')
  get ariaInvalid() {
    return this.errorState;
  }

  @HostBinding('attr.id')
  get attrId() {
    return this.id;
  }

  /** Callback for the cases where the focused state of the input changes. */
  @HostListener('blur', ['$event'])
  @HostListener('focus', ['$event'])
  _focusChanged(isFocused: boolean) {
    if (isFocused !== this.focused && (!this.readonly || !isFocused)) {
      this.focused = isFocused;
      this.stateChanges.next();
    }
  }

  @HostListener('input', ['$event'])
  _onInput() {
    // This is a noop function and is used to let Angular know whenever the value changes.
    // Angular will run a new change detection each time the `input` event has been dispatched.
    // It's necessary that Angular recognizes the value change, because when floatingLabel
    // is set to false and Angular forms aren't used, the placeholder won't recognize the
    // value changes and will not disappear.
    // Listening to the input event wouldn't be necessary when the input is using the
    //
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Internal Methods
  // -----------------------------------------------------------------------------------------------------

  /** Determines if the component host is a textarea. */
  _isTextarea() {
    return this._elementRef.nativeElement.nodeName.toLowerCase() === 'textarea';
  }

  /** Focuses the input. */
  focus(options?: FocusOptions): void {
    this._elementRef.nativeElement.focus(options);
  }

  /**
   * Implemented as part of CosFormFieldControl.
   * @docs-private
   */
  onContainerClick() {
    // Do not re-focus the input element if the element is already focused. Otherwise it can happen
    // that someone clicks on a time input and the cursor resets to the "hours" field while the
    // "minutes" field was actually clicked. See: https://github.com/angular/components/issues/12849
    if (!this.focused) {
      this.focus();
    }
  }

  /**
   * Implemented as part of CosFormFieldControlDirective.
   */
  setDescribedByIds(ids: string[]) {
    this._ariaDescribedby = ids.join(' ');
  }

  /**
   * Implemented as part of CosFormFieldControl.
   * @docs-private
   */
  get empty(): boolean {
    return (
      !this._isNeverEmpty() &&
      !this._elementRef.nativeElement.value &&
      !this._isBadInput() &&
      !this.autofilled
    );
  }

  /** Does some manual dirty checking on the native input `value` property. */
  protected _dirtyCheckNativeValue() {
    const newValue = this._elementRef.nativeElement.value;

    if (this._previousNativeValue !== newValue) {
      this._previousNativeValue = newValue;
      this.stateChanges.next();
    }
  }

  /** Checks whether the input is invalid based on the native validation. */
  protected _isBadInput() {
    // The `validity` property won't be present on platform-server.
    const validity = (this._elementRef.nativeElement as HTMLInputElement)
      .validity;
    return validity && validity.badInput;
  }

  /** Checks whether the input type is one of the types that are never empty. */
  protected _isNeverEmpty() {
    return this._neverEmptyInputTypes.indexOf(this._type) > -1;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Life cycle methods
  // -----------------------------------------------------------------------------------------------------

  ngOnChanges() {
    this.stateChanges.next();
  }

  ngOnInit() {
    this._autofillMonitor
      .monitor(this._elementRef.nativeElement)
      .subscribe((event) => {
        this.autofilled = event.isAutofilled;
        this.stateChanges.next();
      });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement);
  }

  ngDoCheck() {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this.updateErrorState();
    }

    // We need to dirty-check the native element's value, because there are some cases where
    // we won't be notified when it changes (e.g. the consumer isn't using forms or they're
    // updating the value using `emitEvent: false`).
    this._dirtyCheckNativeValue();
  }

  constructor(
    protected _elementRef: ElementRef<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    /** @docs-private */
    @Optional() @Self() public override ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional()
    @Self()
    @Inject(COS_INPUT_VALUE_ACCESSOR)
    inputValueAccessor: any,
    private _autofillMonitor: AutofillMonitor,

    private _uniqueIdService: UniqueIdService
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);

    const element = this._elementRef.nativeElement;

    // If no input value accessor was explicitly specified, use the element as the input value
    // accessor.
    this._inputValueAccessor = inputValueAccessor || element;

    this._previousNativeValue = this.value;

    // Force setter to be called in case id was not specified.
    // eslint-disable-next-line no-self-assign
    this.id = this.id;

    this._isNativeSelect = element.nodeName.toLowerCase() === 'select';

    if (this._isNativeSelect) {
      this.controlType = (element as HTMLSelectElement).multiple
        ? 'cos-native-select-multiple'
        : 'cos-native-select';
    }
  }
}
