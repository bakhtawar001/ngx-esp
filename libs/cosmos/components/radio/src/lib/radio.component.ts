import {
  Component,
  OnInit,
  Input,
  Output,
  HostBinding,
  ChangeDetectorRef,
  AfterContentInit,
  AfterViewInit,
  ElementRef,
  forwardRef,
  ContentChildren,
  Directive,
  EventEmitter,
  QueryList,
  Optional,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  mixinTabIndex,
  HasTabIndexCtor,
  HasTabIndex,
} from '@cosmos/components/core';
import { FocusMonitor } from '@angular/cdk/a11y';

import { UniqueIdService } from '@cosmos/core';

/**
 * Provider Expression that allows Cos-radio-group to register as a ControlValueAccessor. This
 * allows it to support [(ngModel)] and ngControl.
 * @docs-private
 */
export const COS_RADIO_GROUP_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line @angular-eslint/no-forward-ref
  useExisting: forwardRef(() => CosRadioGroupDirective),
  multi: true,
};

/** Change event object emitted by CosRadio and CosRadioGroup. */
export class CosRadioChange {
  constructor(
    /** The CosRadioButton that emits the change event. */
    public source: CosRadioButtonComponent,
    /** The value of the CosRadioButton. */
    public value: any
  ) {}
}

/**
 * A group of radio buttons. May contain one or more `<cos-radio-button>` elements.
 */
@Directive({
  selector: '[cosRadioGroup]',
  providers: [COS_RADIO_GROUP_CONTROL_VALUE_ACCESSOR, UniqueIdService],
})
export class CosRadioGroupDirective
  implements AfterContentInit, ControlValueAccessor
{
  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_required: BooleanInput;

  @Input() size = '';

  /**
   * Event emitted when the group value changes.
   * Change events are only emitted when the value changes due to user interaction with
   * a radio button (the same behavior as `<input type-"radio">`).
   */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output()
  readonly change: EventEmitter<CosRadioChange> = new EventEmitter<CosRadioChange>();

  /** Base class of the text box */
  @HostBinding('class.cos-radio-group') classMain = true;

  @HostBinding('attr.role') role = 'radiogroup';

  /** Selected value for the radio group. */
  private _value: any = null;

  /** The HTML name attribute applied to radio buttons in this group. */
  private _name = `${this._uniqueIdService.getUniqueIdForDom(
    'cos-radio-group'
  )}`;

  /** The currently selected radio button. Should match value. */
  private _selected: CosRadioButtonComponent | null = null;

  /** Whether the `value` has been set to its initial value. */
  private _isInitialized = false;

  /** Whether the labels should appear after or before the radio-buttons. Defaults to 'after' */
  private _labelPosition: 'before' | 'after' = 'after';

  /** Whether the radio group is disabled. */
  private _disabled = false;

  /** Whether the radio group is required. */
  private _required = false;

  /** Child radio buttons. */
  @ContentChildren(
    // eslint-disable-next-line @angular-eslint/no-forward-ref
    forwardRef(() => CosRadioButtonComponent),
    { descendants: true }
  )
  _radios?: QueryList<CosRadioButtonComponent>;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _controlValueAccessorChangeFn: (value: any) => void = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: VoidFunction = () => {};

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /** Name of the radio button group. All radio buttons inside this group will use this name. */
  @Input()
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
    this._updateRadioButtonNames();
  }

  /** Whether the labels should appear after or before the radio-buttons. Defaults to 'after' */
  @Input()
  get labelPosition(): 'before' | 'after' {
    return this._labelPosition;
  }
  set labelPosition(v) {
    this._labelPosition = v === 'before' ? 'before' : 'after';
    this._markRadiosForCheck();
  }

  /**
   * Value for the radio-group. Should equal the value of the selected radio button if there is
   * a corresponding radio button with a matching value. If there is not such a corresponding
   * radio button, this value persists to be applied in case a new radio button is added with a
   * matching value.
   */
  @Input()
  get value(): any {
    return this._value;
  }
  set value(newValue: any) {
    if (this._value !== newValue) {
      // Set this before proceeding to ensure no circular loop occurs with selection.
      this._value = newValue;
      this._updateSelectedRadioFromValue();
      this._checkSelectedRadioButton();
    }
  }

  /**
   * The currently selected radio button. If set to a new radio button, the radio group value
   * will be updated to match the new selected button.
   */
  @Input()
  get selected() {
    return this._selected;
  }
  set selected(selected) {
    this._selected = selected;
    this.value = selected ? selected.value : null;
    this._checkSelectedRadioButton();
  }

  /** Whether the radio group is disabled */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = coerceBooleanProperty(value);
    this._markRadiosForCheck();
  }

  /** Whether the radio group is required */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this._markRadiosForCheck();
  }

  constructor(
    private _changeDetector: ChangeDetectorRef,
    private _uniqueIdService: UniqueIdService
  ) {}

  /**
   * Initialize properties once content children are available.
   * This allows us to propagate relevant attributes to associated buttons.
   */
  ngAfterContentInit() {
    // Mark this component as initialized in AfterContentInit because the initial value can
    // possibly be set by NgModel on CosRadioGroup, and it is possible that the OnInit of the
    // NgModel occurs *after* the OnInit of the CosRadioGroup.
    this._isInitialized = true;
  }

  /**
   * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
   * radio buttons upon their blur.
   */
  _touch() {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  _checkSelectedRadioButton() {
    if (this._selected && !this._selected.checked) {
      this._selected.checked = true;
    }
  }

  private _updateRadioButtonNames(): void {
    if (this._radios) {
      this._radios.forEach((radio) => {
        radio.name = this.name;
        radio._markForCheck();
      });
    }
  }

  /** Updates the `selected` radio button from the internal _value state. */
  private _updateSelectedRadioFromValue(): void {
    // If the value already matches the selected radio, do nothing.
    const isAlreadySelected =
      this._selected !== null && this._selected.value === this._value;

    if (this._radios && !isAlreadySelected) {
      this._selected = null;
      this._radios.forEach((radio) => {
        radio.checked = this.value === radio.value;
        if (radio.checked) {
          this._selected = radio;
        }
      });
    }
  }

  _emitChangeEvent(): void {
    if (this._isInitialized) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.change.emit(new CosRadioChange(this._selected!, this._value));
    }
  }

  _markRadiosForCheck() {
    if (this._radios) {
      this._radios.forEach((radio) => radio._markForCheck());
    }
  }

  /**
   * Sets the model value. Implemented as part of ControlValueAccessor.
   * @param value
   */
  writeValue(value: any) {
    this.value = value;
    this._changeDetector.markForCheck();
  }

  /**
   * Registers a callback to be triggered when the model value changes.
   * Implemented as part of ControlValueAccessor.
   * @param fn Callback to be registered.
   */
  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

  /**
   * Registers a callback to be triggered when the control is touched.
   * Implemented as part of ControlValueAccessor.
   * @param fn Callback to be registered.
   */
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  /**
   * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
   * @param isDisabled Whether the control should be disabled.
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this._changeDetector.markForCheck();
  }
}

abstract class CosRadioButtonBase {
  abstract disabled: boolean;

  constructor(public _elementRef: ElementRef) {}
}
const _CosRadioButtonMixinBase: HasTabIndexCtor & typeof CosRadioButtonBase =
  mixinTabIndex(CosRadioButtonBase, -1);

@Component({
  selector: 'cos-radio-button',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // We have to use the host metadata here so it doesn't inject the variable for tab index into the component class
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[attr.tabindex]': '-1',
  },
})
export class CosRadioButtonComponent
  extends _CosRadioButtonMixinBase
  implements OnInit, AfterViewInit, OnDestroy, HasTabIndex
{
  private _uniqueId = `${this._uniqueIdService.getUniqueIdForDom('cos-radio')}`;

  /**
   * Event emitted when the group value changes.
   * Change events are only emitted when the value changes due to user interaction with
   * a radio button (the same behavior as `<input type-"radio">`).
   */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output()
  readonly change: EventEmitter<CosRadioChange> = new EventEmitter<CosRadioChange>();

  /** The parent radio group. May or may not be present. */
  radioGroup: CosRadioGroupDirective;

  /** ID of the native input element inside `<cos-radio-button>` */
  get inputId(): string {
    return `${this.id || this._uniqueId}-input`;
  }

  /** Whether this radio is checked. */
  private _checked = false;

  /** Whether this radio is disabled. */
  private _disabled = false;

  /** Whether this radio is required. */
  private _required = false;

  /** Value assigned to this radio. */
  private _value: any = null;

  /** The native `<input type=radio>` element */
  @ViewChild('input', { static: true })
  _inputElement!: ElementRef<HTMLInputElement>;

  /** The unique ID for the radio button. */
  @Input() id: string = this._uniqueId;

  /** Analog to HTML 'name' attribute used to group radios for unique selection. */
  @Input() name = '';

  @Input() size = '';

  @HostBinding('class.cos-radio') mainClass = true;

  @HostBinding('class.cos-radio--checked')
  get isChecked() {
    return this.checked;
  }

  @HostBinding('class.cos-radio--disabled')
  get isDisabled() {
    return this.disabled;
  }

  @HostBinding('attr.id')
  get attrId() {
    return this.id;
  }

  @HostBinding('class.cos-radio--small')
  get isSmall() {
    return this.radioGroup.size === 'small' || this.size === 'small';
  }

  /** Used to set the 'aria-label' attribute on the underlying input element. */
  @Input('aria-label') ariaLabel = '';

  /** The 'aria-labelledby' attribute takes precedence as the element's text alternative. */
  @Input('aria-labelledby') ariaLabelledby = '';

  /** The 'aria-describedby' attribute is read after the element's label and field type. */
  @Input('aria-describedby') ariaDescribedby = '';

  /** Whether this radio button is checked. */
  @Input()
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    const newCheckedState = coerceBooleanProperty(value);
    if (this._checked !== newCheckedState) {
      this._checked = newCheckedState;
      if (
        newCheckedState &&
        this.radioGroup &&
        this.radioGroup.value !== this.value
      ) {
        this.radioGroup.selected = this;
      } else if (
        !newCheckedState &&
        this.radioGroup &&
        this.radioGroup.value === this.value
      ) {
        // When unchecking the selected radio button, update the selected radio
        // property on the group.
        this.radioGroup.selected = null;
      }

      if (newCheckedState) {
        // Notify all radio buttons with the same name to un-check.
        this._radioDispatcher.notify(this.id, this.name);
      }
      this._changeDetectorRef.markForCheck();
    }
  }

  /** The value of this radio button. */
  @Input()
  get value(): any {
    return this._value;
  }
  set value(value: any) {
    if (this._value !== value) {
      this._value = value;
      if (this.radioGroup !== null) {
        if (!this.checked) {
          // Update checked when the value changed to match the radio group's value
          this.checked = this.radioGroup.value === value;
        }
        if (this.checked) {
          this.radioGroup.selected = this;
        }
      }
    }
  }

  /** Whether the label should appear after or before the radio button. Defaults to 'after' */
  @Input()
  get labelPosition(): 'before' | 'after' {
    return (
      this._labelPosition ||
      (this.radioGroup && this.radioGroup.labelPosition) ||
      'after'
    );
  }
  set labelPosition(value) {
    this._labelPosition = value;
  }
  private _labelPosition: 'before' | 'after' = 'after';

  /** Whether the radio button is disabled. */
  @Input()
  get disabled(): boolean {
    return (
      this._disabled || (this.radioGroup !== null && this.radioGroup.disabled)
    );
  }
  set disabled(value: boolean) {
    this._setDisabled(coerceBooleanProperty(value));
  }

  /** Whether the radio button is required. */
  @Input()
  get required(): boolean {
    return this._required || (this.radioGroup && this.radioGroup.required);
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _removeUniqueSelectionListener: () => void = () => {};

  constructor(
    @Optional() radioGroup: CosRadioGroupDirective,
    elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
    private _changeDetectorRef: ChangeDetectorRef,
    private _radioDispatcher: UniqueSelectionDispatcher,
    private _uniqueIdService: UniqueIdService
  ) {
    super(elementRef);
    this.radioGroup = radioGroup;

    this._removeUniqueSelectionListener = _radioDispatcher.listen(
      (id: string, name: string) => {
        if (id !== this.id && name === this.name) {
          this.checked = false;
        }
      }
    );
  }

  ngAfterViewInit() {
    this._focusMonitor
      .monitor(this._elementRef, true)
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      .subscribe((focusOrigin) => {
        if (!focusOrigin && this.radioGroup) {
          this.radioGroup._touch();
        }
      });
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._removeUniqueSelectionListener();
  }

  ngOnInit() {
    if (this.radioGroup) {
      // If the radio is inside a radio group, determine if it should be checked
      this.checked = this.radioGroup.value === this._value;
      // Copy name from parent radio group
      this.name = this.radioGroup.name;
    }
  }

  /** Dispatch change event with current value. */
  private _emitChangeEvent(): void {
    this.change.emit(new CosRadioChange(this, this._value));
  }

  _onInputClick(event: Event) {
    // We have to stop propagation for click events on the visual hidden input element.
    // By default, when a user clicks on a label element, a generated click event will be
    // dispatched on the associated input element. Since we are using a label element as our
    // root container, the click event on the `radio-button` will be executed twice.
    // The real click event will bubble up, and the generated click event also tries to bubble up.
    // This will lead to multiple click events.
    // Preventing bubbling for the second event will solve that issue.
    event.stopPropagation();
  }

  @HostListener('focus') onfocus() {
    this._inputElement.nativeElement.focus();
  }

  /**
   * Triggered when the radio button received a click or the input recognized any change.
   * Clicking on a label element, will trigger a change event on the associated input.
   */
  _onInputChange(event: Event) {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();

    const groupValueChanged =
      this.radioGroup && this.value !== this.radioGroup.value;

    this.checked = true;

    this._emitChangeEvent();

    if (this.radioGroup) {
      this.radioGroup._controlValueAccessorChangeFn(this.value);
      this._value = this.value;
      if (groupValueChanged) {
        this.radioGroup._emitChangeEvent();
      }
    }
  }

  /** Focuses the radio button. */
  focus(options?: FocusOptions): void {
    this._focusMonitor.focusVia(this._inputElement, 'keyboard', options);
  }

  /**
   * Marks the radio button as needing checking for change detection.
   * This method is exposed because the parent radio group will directly
   * update bound properties of the radio button.
   */
  _markForCheck() {
    // When group value changes, the button will not be notified. Use `markForCheck` to explicit
    // update radio button's status
    this._changeDetectorRef.markForCheck();
  }

  /** Sets the disabled state and marks for check if a change occurred. */
  protected _setDisabled(value: boolean) {
    if (this._disabled !== value) {
      this._disabled = value;
      this._changeDetectorRef.markForCheck();
    }
  }
}
