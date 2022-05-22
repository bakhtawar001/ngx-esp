/* eslint-disable @typescript-eslint/no-explicit-any */
import { coerceArray } from '@angular/cdk/coercion';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit,
} from '@angular/core';
import {
  FormGroup as NgFormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { AsiFilterPillsModule } from '@asi/ui/feature-filters';
import {
  DigitsOnlyDirectiveModule,
  IncludesPipeModule,
  OrderByPipeModule,
} from '@cosmos/common';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosFiltersModule } from '@cosmos/components/filters';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { CosPillModule } from '@cosmos/components/pill';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@cosmos/forms';
import {
  AggregateValue,
  AggregationTypes,
  CHECK_BOXES,
  CurrentAggregateFilters,
  DEFAULT_CURRENT_FILTERS,
  DEFAULT_SEARCH_CRITERIA,
  DEFAULT_TYPEAHEAD_VALUES,
  excludeTermsFn,
  FiltersForm,
  FILTERS_FORM_DEFAULT,
  formControlClickOut,
  getCheckBoxCount,
  getFilterLabel,
  getTypeAheadCount,
  mapFiltersFormToSearchCriteria,
  mapUrlFiltersToFiltersForm,
  priceFn,
  ProductSearchCriteria,
  quantityFn,
  ratingFn,
  RemoveFilterPayload,
  removeFormFilter,
  SearchFormKeys,
  supplierRatings,
  TypeAheadSearchCriteria,
  TYPE_AHEADS,
} from '@esp/products';
import { SEARCH_FILTER_LOCAL_STATE } from '@esp/search';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { every, isEmpty, isEqual, uniqBy } from 'lodash-es';
import { animationFrameScheduler } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ProductSearchLocalState } from '../../local-states';
import { AggregationTypeaheadComponentModule } from '../aggregation-typeahead/aggregation-typeahead.component';

type SearchTermControl = keyof Pick<
  FiltersForm,
  'CategorySearchTerm' | 'ColorSearchTerm' | 'SupplierSearchTerm'
>;

const DESKTOP_MIN_WIDTH = 1024;

@UntilDestroy()
@Component({
  templateUrl: './product-search-filters.component.html',
  styleUrls: ['./product-search-filters.component.scss'],
  selector: 'esp-product-search-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SEARCH_FILTER_LOCAL_STATE,
      useExisting: ProductSearchLocalState,
    },
  ],
})
export class ProductSearchFiltersComponent implements OnInit {
  private currentFilters: CurrentAggregateFilters = DEFAULT_CURRENT_FILTERS;
  private readonly state$ = this.state.connect(this);

  appliedFiltersPills = {};
  filtersForm = this.createFilterForm();
  ratingsMenuOptions = supplierRatings;
  hasFilters = false;
  isDesktop: boolean;
  showAllSuppliers = true;
  showAllFilters = false;
  subCategories: AggregateValue[] = [];
  typeAheads = { ...TYPE_AHEADS };
  checkBoxes = CHECK_BOXES;
  filtersCount = 0;
  hasSupplierRating = false;
  title = 'Filtering 63,606 products';

  labels = {
    category: 'All Categories',
    color: 'Color',
    excludeTerms: 'Exclude',
    price: 'Price Per Unit',
    quantity: 'Quantity',
    rating: 'All Ratings',
    supplier: 'Supplier',
  };

  colorOptions: AggregateValue[] = [];
  supplierOptions: AggregateValue[] = [];

  constructor(
    public readonly state: ProductSearchLocalState,
    private readonly _fb: FormBuilder,
    private readonly _breakpointObserver: BreakpointObserver
  ) {
    this._breakpointObserver
      .observe([`(min-width: ${DESKTOP_MIN_WIDTH}px)`])
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        this.isDesktop = result.matches;
        this.showAllSuppliers = this.isDesktop;
      });
  }

  get checkboxForm() {
    return this.filtersForm.get('CheckBoxes') as FormGroup;
  }

  get typeAheadParams(): TypeAheadSearchCriteria {
    return {
      from: 1,
      size: 50,
      term: this.state.criteria.term,
      aggregationQuery: '',
      aggregationName: '' as AggregationTypes,
      ...mapFiltersFormToSearchCriteria(this.filtersForm.value),
    };
  }

  get filterDisplay() {
    return this.showAllFilters
      ? 'Show Less'
      : this.filtersCount > 0
      ? `Show More: ${this.filtersCount}`
      : 'Show More';
  }

  ngOnInit(): void {
    // Custom Listener for _filtersForm.Controls ColorSearchTerm and SupplierSearchTerm.
    this.customListeners();
    this.initStateListeners();
  }

  applyFilter(controlName?: SearchTermControl): void {
    this.setSearchCriteriaFilters();
    this._clearSearchTerm(controlName);
    this.showAllFilters = false;
  }

  resetShowMoreFilters(val: Array<string>): void {
    val.forEach((v) => {
      if (v === 'TypeAheads') {
        this.filtersForm.get('TypeAheads')?.reset(DEFAULT_TYPEAHEAD_VALUES);
      } else if (v === 'CheckBoxes') {
        this.filtersForm.get('CheckBoxes')?.reset({});
      } else {
        this.filtersForm.get('IncludeRushTime').reset(false);
      }
    });

    this.setSearchCriteriaFilters();
  }

  resetPriceFilter(controlName: string): void {
    if (controlName === 'Quantity') {
      this.filtersForm.get('PriceFilter.Quantity').reset(null);
    } else {
      this.filtersForm.get('PriceFilter.To').reset(null);
      this.filtersForm.get('PriceFilter.From').reset(null);
    }

    this.applyFilter();
  }

  resetCategory(): void {
    this.currentFilters['CategoryGroup'] = [];
    this.currentFilters['CategoryValue'] = [];

    this.resetFilterToDefault('CategoryGroup');
    this.resetFilterToDefault('CategoryValue');

    this.applyFilter('CategorySearchTerm');
  }

  categoryClickOut(): void {
    this.clickOut('CategoryGroup');
    this.clickOut('CategoryValue', 'CategorySearchTerm');
  }

  clickOut(controlName: string, searchTermControl?: SearchTermControl): void {
    formControlClickOut(controlName, this.filtersForm, this.state.criteria);

    if (this.currentFilters[controlName]) {
      this.currentFilters[controlName] = [];
    }

    this._clearSearchTerm(searchTermControl);
  }

  getCurrentFacetValues(controlName: 'Color' | 'Supplier'): AggregateValue[] {
    const checkedValues = this.currentFilters[controlName] ?? [];
    const facetsFromAlgolia = this.state.facets?.[controlName] ?? [];

    return uniqBy([...checkedValues, ...facetsFromAlgolia], 'Value');
  }

  onClickedOutside(): void {
    this.showAllFilters = false;
  }

  resetFilter(
    controlName?: string,
    searchTermControlName?: SearchTermControl
  ): void {
    if (controlName) {
      this.resetFilterToDefault(controlName);
      this.currentFilters[controlName] = [];
      this.applyFilter(searchTermControlName);
    }
  }

  resetAllFilters(): void {
    this.filtersForm.reset(FILTERS_FORM_DEFAULT);
    this.currentFilters = DEFAULT_CURRENT_FILTERS;
    this.state.search({ ...this.state.criteria, ...DEFAULT_SEARCH_CRITERIA });
  }

  toggleShowAllFilters(): void {
    this.showAllFilters = !this.showAllFilters;
    if (this.showAllFilters) {
      const showMoreFilters = mapUrlFiltersToFiltersForm(this.state.filters);
      const reset = (filterName: string) =>
        this.filtersForm
          .get(filterName)
          .reset(
            filterName !== 'IncludeRushTime'
              ? { ...showMoreFilters?.[filterName] }
              : showMoreFilters?.[filterName]
          );

      reset('TypeAheads');
      reset('CheckBoxes');
      reset('IncludeRushTime');
    }
  }

  checkShiftTabOff(event): void {
    if (event.shiftKey && event.which === 9) this.showAllFilters = false;
  }

  unsorted(): number {
    return 0;
  }

  categoryChanged(value): void {
    this.resetFilterToDefault('CategoryValue');
    const SEARCH_CRITERIA: ProductSearchCriteria = {
      from: 0,
      size: 50,
      term: this.state.criteria.term,
      aggregationsOnly: true,
      ...mapFiltersFormToSearchCriteria({
        ...this.filtersForm.value,
        CategoryGroup: value,
        CategoryValue: [],
      }),
    };
    this.state.search(SEARCH_CRITERIA);
    this.resetFilterToDefault('CategorySearchTerm');
  }

  selectFilter(color: AggregateValue, controlName: string): void {
    const control = this.currentFilters[controlName];
    const currentIndex = control.findIndex((c) => c.Value === color.Value);
    if (currentIndex === -1) {
      control.push({ ...color });
    } else {
      control.splice(currentIndex, 1);
    }
  }

  trackByName(index: number, item: AggregateValue): string {
    return item.Value;
  }

  removeFilter(params: RemoveFilterPayload): void {
    if (params.ClearAll) {
      this.resetAllFilters();
    } else {
      removeFormFilter(this.filtersForm, params.ControlName, params.Value);
      this.applyFilter();
    }
  }

  private initStateListeners(): void {
    this.state$
      .pipe(
        map(({ filters }) => filters),
        debounceTime(0, animationFrameScheduler),
        distinctUntilChanged(isEqual),
        map((filters) => mapUrlFiltersToFiltersForm(filters)),
        untilDestroyed(this)
      )
      .subscribe({
        next: (filters) => {
          filters.SupplierRating ||= '';
          filters.CategoryGroup ||= '';
          this.filtersForm.reset({ ...FILTERS_FORM_DEFAULT, ...filters });
          this._updateFilterState();
        },
      });
  }

  private resetFilterToDefault(filterName: string) {
    this.filtersForm?.get(filterName).reset(FILTERS_FORM_DEFAULT[filterName]);
  }

  private customListeners(): void {
    this.filtersForm
      .get(SearchFormKeys.CategoryGroup)
      .valueChanges.pipe(debounceTime(100), distinctUntilChanged())
      .pipe(untilDestroyed(this))
      .subscribe((value: string[] | string) => {
        // The `value` might be a string or an array of strings, e.g. `CAPS & HATS` or `[CAPS & HATS]`.
        value = coerceArray(value);

        if (
          value[0]?.length > 0 &&
          value[0] !==
            this.state.criteria.filters[SearchFormKeys.CategoryGroup]?.terms[0]
        ) {
          this.categoryChanged(value[0]);
        }
      });

    this.filtersForm
      ?.get('ColorSearchTerm')
      .valueChanges.pipe(debounceTime(100), distinctUntilChanged())
      .pipe(untilDestroyed(this))
      .subscribe((value: string) => {
        this.aggregationsChange({
          aggregationName: 'Color',
          aggregationQuery: value,
        });
      });

    this.filtersForm
      ?.get('SupplierSearchTerm')
      .valueChanges.pipe(debounceTime(200), distinctUntilChanged())
      .pipe(untilDestroyed(this))
      .subscribe((value: string) => {
        this.aggregationsChange({
          aggregationName: 'Supplier',
          aggregationQuery: value,
        });
      });

    this.filtersForm
      .get('PriceFilter.From')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe(() => {
        this.filtersForm
          .get('PriceFilter.To')
          .updateValueAndValidity({ emitEvent: false });
      });

    this.filtersForm
      .get('PriceFilter.To')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe(() => {
        this.filtersForm
          .get('PriceFilter.From')
          .updateValueAndValidity({ emitEvent: false });
      });

    this.state$
      .pipe(
        map((state) => state.criteria),
        distinctUntilChanged(),
        untilDestroyed(this)
      )
      .subscribe((criteria) => {
        const filters = criteria.filters;

        this.labels = {
          category: getFilterLabel(
            filters?.CategoryValue?.terms?.length
              ? filters?.CategoryValue?.terms
              : filters?.CategoryGroup?.terms,
            'All Categories',
            'Categories'
          ),
          color: getFilterLabel(filters?.Color?.terms, 'Color', 'Colors'),
          excludeTerms: excludeTermsFn(criteria),
          price: priceFn(criteria),
          quantity: quantityFn(criteria),
          rating: ratingFn(criteria),
          supplier: getFilterLabel(
            filters?.Supplier?.terms,
            'Supplier',
            'Suppliers'
          ),
        };
        this.hasSupplierRating = !!criteria.numericFilters.find(
          (f) => f.Name === 'SupplierRating'
        )?.From;
      });

    this.state$
      .pipe(
        map((state) => state.facets?.Supplier),
        distinctUntilChanged(),
        untilDestroyed(this)
      )
      .subscribe({
        next: () =>
          (this.supplierOptions = this.getCurrentFacetValues('Supplier')),
      });

    this.state$
      .pipe(
        map((state) => state.facets?.Color),
        distinctUntilChanged(),
        untilDestroyed(this)
      )
      .subscribe({
        next: () => (this.colorOptions = this.getCurrentFacetValues('Color')),
      });
  }

  private aggregationsChange(criteria: Partial<TypeAheadSearchCriteria>): void {
    const SEARCH_CRITERIA = {
      ...this.state.criteria,
      size: 50,
      term: this.state.criteria.term,
      ...criteria,
      aggregationName: criteria.aggregationName,
      aggregationQuery: criteria.aggregationQuery,
    };

    this.state.facetSearch(SEARCH_CRITERIA);
  }

  private setSearchCriteriaFilters(): void {
    this.state.search({
      ...this.state.criteria,
      from: 1,
      organicSize: 0,
      ...mapFiltersFormToSearchCriteria(this.filtersForm?.value),
    });
  }

  private _clearSearchTerm(controlName: SearchTermControl): void {
    this.filtersForm?.get(controlName)?.setValue('');
  }

  private createFilterForm() {
    const addCheckboxes = (filterForm: FormGroup): void => {
      const checkBoxes = new NgFormGroup({});
      filterForm.addControl('CheckBoxes', checkBoxes);
      for (const checkbox of CHECK_BOXES) {
        checkBoxes.addControl(checkbox.value, new FormControl(false, []));
      }
    };

    const addTypeAheads = (filterForm: FormGroup): void => {
      const typeAheadGroup = new NgFormGroup({});
      filterForm.addControl('TypeAheads', typeAheadGroup);
      for (const key in TYPE_AHEADS) {
        DEFAULT_TYPEAHEAD_VALUES[key] = '';
        typeAheadGroup.addControl(key, new FormControl('', []));
      }
    };

    const filterForm = this._fb.group<FiltersForm>({
      CategorySearchTerm: [''],
      SupplierSearchTerm: [''],
      ColorSearchTerm: [''],
      CategoryGroup: [''],
      CategoryValue: [[]],
      Supplier: [[]],
      SupplierRating: [''],
      Color: [[]],
      ExcludeTerms: [''],
      IncludeRushTime: [false],
      PriceFilter: this._fb.group({
        Quantity: [null, [Validators.min(0), Validators.max(99999999)]],
        From: [
          null,
          [
            Validators.min(0),
            Validators.max(9999999.999),
            this.comparison('To', (From, To) => {
              return (
                !From?.toString().length ||
                !To?.toString().length ||
                Number(From) <= Number(To)
              );
            }),
          ],
        ],
        To: [
          null,
          [
            Validators.min(0),
            Validators.max(9999999.999),
            this.comparison('From', (To, From) => {
              return (
                !From?.toString().length ||
                !To?.toString().length ||
                Number(From) <= Number(To)
              );
            }),
          ],
        ],
      }),
    });

    addCheckboxes(filterForm);
    addTypeAheads(filterForm);

    return filterForm;
  }

  private comparison(
    field: 'From' | 'To',
    predicate: (fieldVal, fieldToCompareVal) => boolean
  ): ValidatorFn {
    return (control: AbstractControl<unknown>): { [key: string]: any } => {
      const group = control.parent;
      const fieldToCompare = group?.get(field);
      const valid = predicate(control.value, fieldToCompare?.value);
      return valid ? null : { comparison: { value: control.value } };
    };
  }

  private _updateFilterState(): void {
    const criteria = this.state.criteria;
    const filters = this.filtersForm.value;

    this.currentFilters.Color =
      filters.Color?.map((name) => ({
        Value: name,
      })) ?? [];

    this.currentFilters.Supplier =
      filters.Supplier?.map((name) => ({
        Value: name,
      })) ?? [];

    this.filtersCount =
      getTypeAheadCount(filters.TypeAheads) +
      getCheckBoxCount(filters.CheckBoxes);

    this.hasFilters =
      criteria.excludeTerm?.length > 0 ||
      criteria.numericFilters.length > 0 ||
      !every(Object.values(this.state.criteria.filters), isEmpty) ||
      !every(
        Object.values(criteria.priceFilter ?? {}),
        (value) => value == null
      );
  }
}

@NgModule({
  declarations: [ProductSearchFiltersComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CosButtonModule,
    CosCheckboxModule,
    CosFiltersModule,
    CosFormFieldModule,
    CosInputModule,
    CosPillModule,
    DigitsOnlyDirectiveModule,
    OrderByPipeModule,
    MatListModule,
    AggregationTypeaheadComponentModule,
    IncludesPipeModule,
    AsiFilterPillsModule,
  ],
  exports: [ProductSearchFiltersComponent],
})
export class ProductSearchFiltersComponentModule {}
