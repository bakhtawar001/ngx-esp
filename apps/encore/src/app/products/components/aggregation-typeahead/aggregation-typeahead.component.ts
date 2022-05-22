/* eslint-disable @typescript-eslint/no-empty-function */
import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Inject,
  Input,
  NgModule,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { CosAutocompleteModule } from '@cosmos/components/autocomplete';
import {
  AggregateValue,
  AggregationTypes,
  getProductionTimeValues,
  TypeAheadSearchCriteria,
  TYPE_AHEADS,
} from '@esp/products';
import { SearchFilterLocalState, SEARCH_FILTER_LOCAL_STATE } from '@esp/search';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-aggregation-typeahead',
  templateUrl: './aggregation-typeahead.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AggregationTypeAheadComponent),
      multi: true,
    },
  ],
})
export class AggregationTypeAheadComponent
  implements ControlValueAccessor, OnInit
{
  //-------------------------------------------------------------
  // @private Accessors
  //---------------------------------------------------------------
  //--------------------------------------------------------------
  // @Input() & @Output()
  //---------------------------------------------------------------
  @Input() label: string;
  @Input() placeholder: string;
  @Input() params: TypeAheadSearchCriteria;
  @Input() aggregationName: string;
  @Input() aggregationValues: AggregateValue[] = [];

  //---------------------------------------------------------------------------
  // @Constructor
  //----------------------------------------------------------------------------

  constructor(
    @Inject(SEARCH_FILTER_LOCAL_STATE)
    public readonly state: SearchFilterLocalState,
    private readonly _cd: ChangeDetectorRef
  ) {
    this.value.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((val: AggregateValue) => {
        this.onChange(val);
        this.onTouched();
      });
  }

  //-------------------------------------------------
  // @Public Accessors
  //-------------------------------------------------

  value = new FormControl();
  isDisabled = false;
  typeAheads = TYPE_AHEADS;

  //----------------------------------------------------
  // @LifeCycle Hooks
  //----------------------------------------------------
  ngOnInit(): void {
    if (TYPE_AHEADS[this.aggregationName] === TYPE_AHEADS?.ProductionTime) {
      this.aggregationValues = [...getProductionTimeValues()];
    }
  }

  //--------------------------------------------------
  // @Publics Methods
  //--------------------------------------------------

  onChange: (value: AggregateValue) => void = () => {};

  onTouched?: () => void = () => {};

  registerOnChange(fn: (value: AggregateValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  search(queryName: string): void {
    if (TYPE_AHEADS[this.aggregationName] !== TYPE_AHEADS?.ProductionTime) {
      this.getTypeAheads(queryName);
    }
  }

  writeValue(value: AggregateValue): void {
    this.aggregationValues.length ? this.value.enable() : this.value.disable();
    this.value.setValue(value);
  }

  //-------------------------------------------------------------------------------
  //@Private Method
  //-------------------------------------------------------------------------------
  private getTypeAheads(queryName: string): void {
    this.state.facetSearch({
      ...this.params,
      aggregationQuery: queryName,
      aggregationName: this.aggregationName as AggregationTypes,
    });
  }
}

@NgModule({
  declarations: [AggregationTypeAheadComponent],
  exports: [AggregationTypeAheadComponent],
  imports: [CosAutocompleteModule, ReactiveFormsModule],
})
export class AggregationTypeaheadComponentModule {}
