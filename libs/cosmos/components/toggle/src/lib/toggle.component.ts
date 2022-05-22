import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  CanDisable,
  mixinDisabled,
  HasTabIndex,
  mixinTabIndex,
} from '@cosmos/components/core';
import {
  CosSlideToggleDefaultOptions,
  COS_SLIDE_TOGGLE_DEFAULT_OPTIONS,
} from './toggle-config';

let nextUniqueId = 0;

export const COS_SLIDE_TOGGLE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line @angular-eslint/no-forward-ref
  useExisting: forwardRef(() => CosSlideToggleComponent),
  multi: true,
};

export class CosSlideToggleChange {
  constructor(
    public source: CosSlideToggleComponent,
    public checked: boolean
  ) {}
}

/* Mixin boilerplate for adding additional class functionality */
const _CosSlideToggleBase = mixinTabIndex(
  mixinDisabled(
    class {
      constructor(public _elementRef: ElementRef) {}
    }
  )
);

@Component({
  selector: 'cos-toggle',
  templateUrl: 'toggle.component.html',
  styleUrls: ['toggle.component.scss'],
  providers: [COS_SLIDE_TOGGLE_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosSlideToggleComponent
  extends _CosSlideToggleBase
  implements
    OnInit,
    OnDestroy,
    AfterContentInit,
    ControlValueAccessor,
    CanDisable,
    HasTabIndex
{
  static ngAcceptInputType_required: BooleanInput;
  static ngAcceptInputType_checked: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_disableRipple: BooleanInput;

  private _uniqueId = `cos-slide-toggle-${++nextUniqueId}`;
  private _required = false;
  private _checked = false;

  /** Reference to the thumb HTMLElement. */
  @ViewChild('thumbContainer') _thumbEl!: ElementRef;

  /** Reference to the thumb bar HTMLElement. */
  @ViewChild('toggleBar') _thumbBarEl!: ElementRef;

  @Input() options!: CosSlideToggleDefaultOptions;

  /** Name value will be applied to the input element if present. */
  @Input() name: string | null = null;

  /** A unique id for the slide-toggle input. If none is supplied, it will be auto-generated. */
  @Input() id: string = this._uniqueId;

  /** Whether the label should appear after or before the slide-toggle. Defaults to 'after'. */
  @Input() labelPosition: 'before' | 'after' = 'after';

  @Input() override disabled = false;

  @Input() override tabIndex: number;

  @Input() size = '';

  /** Used to set the aria-label attribute on the underlying input element. */
  @Input('aria-label') ariaLabel: string | null = null;

  /** Used to set the aria-labelledby attribute on the underlying input element. */
  @Input('aria-labelledby') ariaLabelledby: string | null = null;

  /** Whether the slide-toggle is required. */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value) {
    this._required = coerceBooleanProperty(value);
  }

  /** Whether the slide-toggle element is checked or not. */
  @Input()
  get checked(): boolean {
    return this._checked;
  }
  set checked(value) {
    this._checked = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
  }

  /* Event for when the value of the toggle changs */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output()
  readonly change: EventEmitter<CosSlideToggleChange> = new EventEmitter<CosSlideToggleChange>();

  /* Event for when the toggle is interacted with, it does not mean the value has been changed */
  @Output()
  readonly toggleChange: EventEmitter<void> = new EventEmitter<void>();

  /** Returns the unique id for the visual hidden input. */
  get inputId(): string {
    return `${this.id || this._uniqueId}-input`;
  }

  /** Reference to the underlying input element. */
  @ViewChild('input') _inputElement!: ElementRef<HTMLInputElement>;

  @HostBinding('attr.aria-label')
  get hasAriaLabel() {
    return null;
  }

  @HostBinding('attr.aria-labelledby')
  get hasAriaLabelledBy() {
    return null;
  }

  @HostBinding('attr.tabindex')
  get tabIndexValue() {
    return this.disabled ? null : -1;
  }

  @HostBinding('class')
  get mainClass() {
    return 'cos-slide-toggle';
  }

  @HostBinding('class.cos-checked')
  get isChecked() {
    return this.checked;
  }

  @HostBinding('class.cos-disabled')
  get isDisabled() {
    return this.disabled;
  }

  @HostBinding('class.cos-slide-toggle--small')
  get isSmall() {
    return this.size === 'small';
  }

  @HostBinding('class.cos-slide-toggle-label-before')
  get isLabelBefore() {
    return this.labelPosition === 'before';
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange = (_: any) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched = () => {};

  constructor(
    elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
    private _changeDetectorRef: ChangeDetectorRef,
    // eslint-disable-next-line @angular-eslint/no-attribute-decorator
    @Attribute('tabindex') tabIndex: string | null,
    @Inject(COS_SLIDE_TOGGLE_DEFAULT_OPTIONS)
    private defaultOptions: CosSlideToggleDefaultOptions,
    @Optional() _dir: Directionality | null
  ) {
    super(elementRef);
    this.tabIndex = parseInt(tabIndex || '0', 10);
  }

  ngOnInit(): void {
    this.options = this.options || this.defaultOptions;
  }

  ngAfterContentInit() {
    this._focusMonitor
      .monitor(this._elementRef, true)
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      .subscribe((focusOrigin) => {
        if (focusOrigin === 'keyboard' || focusOrigin === 'program') {
          this._inputElement.nativeElement.focus();
        } else if (!focusOrigin) {
          Promise.resolve().then(() => this._onTouched());
        }
      });
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  _onChangeEvent(event: Event) {
    event.stopPropagation();
    this.toggleChange.emit();

    if (this.options.disableToggleValue) {
      this._inputElement.nativeElement.checked = this.checked;
      return;
    }

    // Sync the value from the underlying input element with the component instance.
    this.checked = this._inputElement.nativeElement.checked;

    // there is no change event, when the checked state changes programmatically.
    this._emitChangeEvent();
  }

  /** Method being called whenever the slide-toggle has been clicked. */
  _onInputClick(event: Event) {
    event.stopPropagation();
    ngDevMode && NgZone.assertNotInAngularZone();
  }

  /** Implemented as part of ControlValueAccessor. */
  writeValue(value: any): void {
    this.checked = !!value;
  }

  /** Implemented as part of ControlValueAccessor. */
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  /** Implemented as part of ControlValueAccessor. */
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  /** Implemented as a part of ControlValueAccessor. */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
  }

  /** Focuses the slide-toggle. */
  focus(options?: FocusOptions): void {
    this._focusMonitor.focusVia(this._inputElement, 'keyboard', options);
  }

  /** Toggles the checked state of the slide-toggle. */
  toggle(): void {
    this.checked = !this.checked;
    this._onChange(this.checked);
  }

  /**
   * Emits a change event on the `change` output. Also notifies the FormControl about the change.
   */
  private _emitChangeEvent() {
    this._onChange(this.checked);
    this.change.emit(new CosSlideToggleChange(this, this.checked));
  }

  /** Method being called whenever the label text changes. */
  _onLabelTextChange() {
    this._changeDetectorRef.detectChanges();
  }
}
