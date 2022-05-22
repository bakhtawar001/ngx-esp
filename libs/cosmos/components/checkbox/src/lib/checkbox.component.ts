import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  CanDisable,
  HasTabIndex,
  mixinDisabled,
  mixinTabIndex,
} from '@cosmos/components/core';

// Increasing integer for generating unique ids for checkbox components.
let nextUniqueId = 0;

/** Change event object emitted by CosCheckboxComponent. */
export class CosCheckboxChange {
  /** The source CosCheckboxComponent of the event. */
  source!: CosCheckboxComponent;
  /** The new `checked` value of the checkbox. */
  checked!: boolean;
}

const _CosCheckboxBase = mixinTabIndex(
  mixinDisabled(
    class {
      constructor(public _elementRef: ElementRef) {}
    }
  )
);

@Component({
  selector: 'cos-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CosCheckboxComponent),
      multi: true,
    },
  ],
})
export class CosCheckboxComponent
  extends _CosCheckboxBase
  implements CanDisable, HasTabIndex, ControlValueAccessor
{
  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_required: BooleanInput;
  static ngAcceptInputType_indeterminate: BooleanInput;

  /** Whether the label is hidden. */
  @Input() labelHidden = false;

  /** Whether the checkbox is required. */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }
  /**
   * Whether the checkbox is checked.
   */
  @Input()
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    if (value !== this.checked) {
      this._checked = value;
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   * Whether the checkbox is indeterminate. This is also known as "mixed" mode and can be used to
   * represent a checkbox with three states, e.g. a checkbox that represents a nested list of
   * checkable items. Note that whenever checkbox is manually clicked, indeterminate is immediately
   * set to false.
   */
  @Input()
  get indeterminate(): boolean {
    return this._indeterminate;
  }
  set indeterminate(value: boolean) {
    const changed = value !== this._indeterminate;
    this._indeterminate = coerceBooleanProperty(value);

    if (changed) {
      this.indeterminateChange.emit(this._indeterminate);
    }

    this._syncIndeterminate(this._indeterminate);
  }

  /**
   * Whether the checkbox is disabled. This fully overrides the implementation provided by
   * mixinDisabled, but the mixin is still required because mixinTabIndex requires it.
   */
  @Input()
  override get disabled() {
    return this._disabled;
  }
  override set disabled(value: any) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this.disabled) {
      this._disabled = newValue;
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Base class of the text box */
  @HostBinding('class')
  get classList() {
    return `cos-checkbox`;
  }

  @HostBinding('class.cos-checkbox--small')
  get isSmall() {
    return this.size === 'small';
  }

  @HostBinding('class.cos-checkbox-indeterminate')
  get isIndeterinate() {
    return this.indeterminate;
  }

  @HostBinding('class.cos-checkbox-checked')
  get isChecked() {
    return this.checked || this.indeterminate;
  }

  @HostBinding('class.cos-checkbox-disabled')
  get isDisabled() {
    return this.disabled;
  }

  @HostBinding('class.cos-checkbox-label-before')
  get labelBefore() {
    return this.labelPosition === 'before';
  }

  /** Returns the unique id for the visual hidden input. */
  get inputId(): string {
    return `${this.id || this._uniqueId}-input`;
  }

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _focusMonitor: FocusMonitor,

    // eslint-disable-next-line @angular-eslint/no-attribute-decorator
    @Attribute('tabindex') tabIndex: string
  ) {
    super(elementRef);
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this._focusMonitor.monitor(elementRef, true).subscribe((focusOrigin) => {
      if (!focusOrigin) {
        // When a focused element becomes disabled, the browser *immediately* fires a blur event.
        // Angular does not expect events to be raised during change detection, so any state change
        // (such as a form control's 'ng-touched') will cause a changed-after-checked error.
        // See https://github.com/angular/angular/issues/17793. To work around this, we defer
        // telling the form control it has been touched until the next tick.
        Promise.resolve().then(() => {
          this._onTouched();
          this.onTouched(focusOrigin);
          _changeDetectorRef.markForCheck();
        });
      }
    });
  }

  private _uniqueId = `cos-checkbox-${++nextUniqueId}`;
  private _required = false;
  private _checked = false;
  private _disabled = false;

  /** A unique id for the checkbox input. If none is supplied, it will be auto-generated. */
  @Input() id: string = this._uniqueId;
  private _indeterminate = false;

  /**
   * Attached to the aria-label attribute of the host element. In most cases, aria-labelledby will
   * take precedence so this may be omitted.
   */
  @Input('aria-label') ariaLabel = '';

  /**
   * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
   */
  @Input('aria-labelledby') ariaLabelledby: string | null = null;

  /** Name value will be applied to the input element if present */
  @Input() name: string | null = null;

  /** The value attribute of the native input element */

  @Input() value!: string;

  @Input() size!: string;

  /** Get the position of the level in relation to the checkbox */
  @Input() labelPosition: 'before' | 'after' = 'after';

  /** The native `<input type="checkbox">` element */
  @ViewChild('input') _inputElement!: ElementRef<HTMLInputElement>;

  /** Event emitted when the checkbox's `indeterminate` value changes. */
  @Output()
  readonly indeterminateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Event emitted when the checkbox's `checked` value changes. */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output()
  readonly change: EventEmitter<CosCheckboxChange> = new EventEmitter<CosCheckboxChange>();

  /** Event emitted when the checkbox's native element is focused. */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output()
  readonly focused: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Event emitted when the checkbox's native element is blurred. */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output()
  readonly blurred: EventEmitter<boolean> = new EventEmitter<boolean>();

  onChange = (val: any) => {};
  onTouched = (val: any) => {};

  _onLabelTextChange() {}

  /**
   * Syncs the indeterminate value with the checkbox DOM node.
   *
   * We sync `indeterminate` directly on the DOM node, because in Ivy the check for whether a
   * property is supported on an element boils down to `if (propName in element)`. Domino's
   * HTMLInputElement doesn't have an `indeterminate` property so Ivy will warn during
   * server-side rendering.
   */
  private _syncIndeterminate(value: boolean) {
    const nativeCheckbox = this._inputElement;

    if (nativeCheckbox) {
      nativeCheckbox.nativeElement.indeterminate = value;
    }
  }

  private _emitChangeEvent() {
    const event = new CosCheckboxChange();
    event.source = this;
    event.checked = this.checked;

    this._controlValueAccessorChangeFn(this.checked);
    this.change.emit(event);
  }

  private _controlValueAccessorChangeFn: (value: any) => void = () => {};

  _getAriaChecked(): 'true' | 'false' | 'mixed' {
    if (this.checked) {
      return 'true';
    }
    return this.indeterminate ? 'mixed' : 'false';
  }

  /** Toggles the `checked` state of the checkbox. */
  toggle(): void {
    this.checked = !this.checked;

    this.onChange(this.checked);
  }

  _onFocus(event: Event) {
    this.focused.emit(true);
  }

  _onBlur(event: Event) {
    this.blurred.emit(true);
  }

  _onInteractionEvent(event: Event) {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();
  }

  /**
   * Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor.
   */
  _onTouched: () => any = () => {};

  /**
   * Event handler for checkbox input element.
   * Toggles checked state if element is not disabled.
   * Do not toggle on (change) event since IE doesn't fire change event when
   *   indeterminate checkbox is clicked.
   * @param event
   */
  _onInputClick(event: Event) {
    // We have to stop propagation for click events on the visual hidden input element.
    // By default, when a user clicks on a label element, a generated click event will be
    // dispatched on the associated input element. Since we are using a label element as our
    // root container, the click event on the `checkbox` will be executed twice.
    // The real click event will bubble up, and the generated click event also tries to bubble up.
    // This will lead to multiple click events.
    // Preventing bubbling for the second event will solve that issue.
    event.stopPropagation();

    // If resetIndeterminate is false, and the current state is indeterminate, do nothing on click
    if (!this.disabled) {
      // When user manually click on the checkbox, `indeterminate` is set to false.
      if (this.indeterminate) {
        Promise.resolve().then(() => {
          this._indeterminate = false;
          this.indeterminateChange.emit(this._indeterminate);
        });
      }

      this.toggle();

      // Emit our custom change event if the native input emitted one.
      // It is important to only emit it, if the native input triggered one, because
      // we don't want to trigger a change event, when the `checked` variable changes for example.
      this._emitChangeEvent();
      // eslint-disable-next-line no-dupe-else-if
    } else if (!this.disabled) {
      // Reset native input when clicked with noop. The native checkbox becomes checked after
      // click, reset it to be align with `checked` value of `cos-checkbox`.
      this._inputElement.nativeElement.checked = this.checked;
      this._inputElement.nativeElement.indeterminate = this.indeterminate;
    }
  }

  /** Focuses the checkbox. */
  focus(origin: FocusOrigin = 'keyboard', options?: FocusOptions): void {
    this._focusMonitor.focusVia(this._inputElement, origin, options);
  }

  ngAfterViewInit() {
    this._syncIndeterminate(this._indeterminate);
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  writeValue(val: boolean): void {
    this.checked = val;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
