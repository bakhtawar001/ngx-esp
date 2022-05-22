import { BooleanInput } from '@angular/cdk/coercion';
import {
  A,
  DOWN_ARROW,
  END,
  HOME,
  NINE,
  SPACE,
  UP_ARROW,
  Z,
  ZERO,
} from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { CanDisable, mixinDisabled } from '@cosmos/components/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { timer } from 'rxjs';
import { delay } from 'rxjs/operators';

const _CosAutoCompleteBase = mixinDisabled(
  class {
    constructor(public _elementRef: ElementRef) {}
  }
);

@UntilDestroy()
@Component({
  selector: 'cos-autocomplete',
  templateUrl: 'autocomplete.component.html',
  styleUrls: ['autocomplete.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CosAutocompleteComponent,
      multi: true,
    },
  ],
  host: {
    '[attr.aria-disabled]': 'disabled.toString()',
  },
  inputs: ['disabled'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosAutocompleteComponent
  extends _CosAutoCompleteBase
  implements CanDisable, AfterViewInit, ControlValueAccessor, OnInit
{
  /** only used in select mode */
  @ViewChild(MatSelect) matSelect!: MatSelect;

  @ViewChild(MatAutocomplete) matAutocomplete!: MatAutocomplete;
  @ViewChildren(MatOption) matOptions!: QueryList<MatOption>;
  @ViewChild('input') inputRef!: MatAutocompleteTrigger;

  @ContentChild(TemplateRef, { static: false })
  template: TemplateRef<any> | null = null;

  panelClass = 'cos-autocomplete-panel';

  activatedOption?: { value: string; index: number };
  selectedOption: { value: string; index: number } = { value: '', index: -1 };

  @Output() onSearch = new EventEmitter<string>();

  @Input()
  withCustomOption = false;
  @Input()
  required = false;

  @Input()
  set defaultValue(val: any) {
    this.writeValue(val);
  }

  /**
   * Implemented as part ControlValueAccessor;.
   */
  @Input()
  get value(): string {
    const selectedOption = this.matOptions?.find((x) => x.selected);
    return selectedOption ? selectedOption.value : '';
  }
  set value(value: string) {
    if (value === this.value || !this.matOptions) {
      return;
    }

    this.matOptions.forEach((x) => {
      if (value === x.value) {
        x.select();
        x.setActiveStyles();
        this.writeValue(x.value);
      }
    });
  }

  /**
   * Implemented as part of ControlValueAccessor;.
   */
  writeValue(value: any): void {
    if (
      value &&
      this.matOptions &&
      !this.matOptions
        .toArray()
        .map((x) => this.normalizeValue(x.value))
        .includes(value ? this.normalizeValue(value) : undefined) &&
      !this.withCustomOption
    ) {
      console.error(
        `CosAutocomplete:writeValue - value "${value}" not found in options`
      );
      return;
    }
    this.value = value;

    if (this.mode == 'select' && this.matSelect) {
      this.matSelect.value = this.value;
      this.matSelect.placeholder = this.value;
    } else {
      // show the selected value in the text input version
      this.searchControl.setValue(value);

      this.activatedOption = {
        value,
        index: this._getFilteredOptionIndex(value),
      };
    }
  }

  /**
   * Implemented as part of ControlValueAccessor;.
   */
  public onChange = (obj: any) => {};

  clear(): void {
    this.searchControl.setValue('');
    this.writeValue('');
    this.onChange('');
  }

  closePanel(): void {
    timer(300)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        const displayProp = this.valueSelector || (this.displayKey as string);
        if (
          !this.withCustomOption &&
          displayProp &&
          !this.searchControl.value?.[displayProp]
        ) {
          this.clear();
        }

        this.inputRef.closePanel();
        this.inputRef['_element']?.nativeElement?.blur();
      });
  }

  /**
   * Implemented as part of ControlValueAccessor;.
   */
  registerOnChange(fn: VoidFunction): void {
    this.onChange = fn;
    if (this.mode == 'search') {
      this.matAutocomplete?.optionSelected
        .pipe(untilDestroyed(this))
        .subscribe(({ option: { value } }) => {
          this.onChange(value);
        });
    } else {
      this.matSelect?.valueChange
        .pipe(untilDestroyed(this))
        .subscribe(this.onChange);
    }
  }

  public onTouched = () => {};

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /** data to create options */
  @Input() data: any[] = [];

  @Input() displayKey?: string | ((obj: any) => string);

  /** value to pluck out of [Object] input */
  @Input() valueSelector: string | undefined;

  /**
   * Prevents home / end key being propagated to mat-select,
   * allowing to move the cursor within the search input instead of navigating the options
   *
   * @source:  https://github.com/bithost-gmbh/ngx-mat-select-search/blob/master/src/app/mat-select-search/mat-select-search.component.ts
   */
  @Input() preventHomeEndKeyPropagation = false;

  @Input() label?: string;

  @Input() placeholder?: string;
  /** placeholder for search box inside of select mode */
  @Input() searchPlaceholder?: string;

  /** compoent has two mode "search" (input autocomplete) and "select" (select with searchable options) */
  @Input() mode = 'search';

  /** transforms both the searchValue and data to a format
   * that can be compared and filtered
   */
  @Input() valueNormalization?: <T>(val: T) => T;

  /** custom function for filter criteria */
  @Input() filterFn = (
    rawData: any,
    normalizedDatum: any,
    normalizedSearchTerm: string
  ) => normalizedDatum.includes(normalizedSearchTerm);

  @Input() maxLength = 99999999;

  public searchControl = new FormControl('');

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((val) => {
        if (typeof val === 'string') {
          this.onSearch.next(val);
        }
      });
  }

  _onValueChanged(value: any): void {
    // this.onChange.emit(value);
    this.onChange(value);
  }

  ngAfterViewInit(): void {
    if (this.mode == 'select') {
      // fires when the select dropdown panel is opened or closed
      this.matSelect.openedChange
        .pipe(delay(1), untilDestroyed(this))
        .subscribe((opened) => {
          if (opened) {
            // focus the search field when opening
            (this.inputRef as unknown as ElementRef).nativeElement?.focus();
          } else {
            // clear it when closing
            this.writeValue('');
          }
        });
    }
  }

  /**
   * text input version:
   *  updates the screen reader text on keyboard navigation of options */
  onActivatedOption({ option }: any): void {
    if (option) {
      const index = this._getFilteredOptionIndex(option.value);
      this.activatedOption = { value: option.value, index };
    }
  }

  _getFilteredOptionIndex(val: string): number {
    const index = this.valueSelector
      ? this.filteredData.map((x) => x[this.valueSelector!]).indexOf(val)
      : this.filteredData.indexOf(val);
    return index;
  }

  get filteredData(): any[] {
    const normalizedSearch = this.normalizeValue(this.searchControl.value);

    const rtrnData =
      this.searchControl.value?.length > 0
        ? this.data.filter((x) => {
            /** TODO: need to use valueSelector or display key not both,
             * as they accomplish the same thing
             */
            const dataProp = this.valueSelector || (this.displayKey as string);
            /** pluck value from object to normalize */
            const datum = dataProp ? x[dataProp] : x;

            return this.filterFn(
              x,
              this.normalizeValue(datum),
              normalizedSearch
            );
          })
        : this.data;

    return rtrnData || [];
  }

  /** transform values from both the search inputs and the
   * list so a comparison can be made for filtering
   */
  normalizeValue(value: any): any {
    if (
      this.valueNormalization &&
      typeof this.valueNormalization === 'function'
    ) {
      return this.valueNormalization(value);
    } else if (typeof value === 'string') {
      return value.toLowerCase();
    }

    return value;
  }

  getDisplayName() {
    return (value: any) => {
      /** TODO: refactor giant if block  */
      if (typeof value === 'string') {
        return value;
      } else if (!value) {
        return '';
      } else if (this.displayKey && typeof this.displayKey === 'string') {
        return value[this.displayKey];
      } else if (typeof this.displayKey === 'function') {
        return this.displayKey(value);
      } else {
        return value;
      }
    };
  }

  /**
   * Handles the key down event with MatSelect.
   * Allows e.g. selecting with enter key, navigation with arrow keys, etc.
   * @param event
   */
  _handleKeydown(event: KeyboardEvent) {
    // Prevent propagation for all alphanumeric characters in order to avoid selection issues
    if (
      (event.key && event.key.length === 1) ||
      (event.keyCode >= A && event.keyCode <= Z) ||
      (event.keyCode >= ZERO && event.keyCode <= NINE) ||
      event.keyCode === SPACE ||
      (this.preventHomeEndKeyPropagation &&
        (event.keyCode === HOME || event.keyCode === END))
    ) {
      event.stopPropagation();
    }
  }

  /**
   * Handles the key up event with MatSelect.
   * Allows e.g. the announcing of the currently activeDescendant by screen readers.
   */
  _handleKeyup(event: KeyboardEvent) {
    if (event.keyCode === UP_ARROW || event.keyCode === DOWN_ARROW) {
      const ariaActiveDescendantId = this.matSelect._getAriaActiveDescendant();
      const index = this.matOptions
        .toArray()
        .findIndex((item) => item.id === ariaActiveDescendantId);

      if (index !== -1) {
        const activeDescendant = this.matOptions.toArray()[index];
        this.activatedOption = {
          value: activeDescendant.viewValue,
          index: this._getFilteredOptionIndex(activeDescendant.viewValue) + 1,
        };
      }
    }
  }

  //------------------------------------------------------------
  // @Static Accessors
  //------------------------------------------------------------
  static ngAcceptInputType_disabled: BooleanInput;
}
