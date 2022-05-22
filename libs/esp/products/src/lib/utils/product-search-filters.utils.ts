import { coerceArray } from '@angular/cdk/coercion';
import { FormGroup } from '@cosmos/forms';
import { isArray } from 'lodash-es';
import { CHECK_BOXES, ProductionTimeItem, TYPE_AHEADS } from '../constants';
import {
  FiltersForm,
  FILTERS_FORM_DEFAULT,
  SearchFormKeys,
  supplierRatings,
} from '../constants/product-search-filters.constants';
import {
  AggregateValue,
  NumericFilter,
  ProductSearchCriteria,
  TypeAheads,
  UrlFilters,
} from '../types';

//----------------------------------------------------------------------------------------------------------
// @Private Functions
//------------------------------------------------------------------------------------------------------------

function getTypeAHeadValues(typeAheads: TypeAheads<AggregateValue>): {
  [key: string]: Array<string>;
} {
  const types: { [key: string]: Array<string> } = {};
  Object.keys(typeAheads).forEach((key) => {
    if (
      typeAheads[key]?.Value &&
      TYPE_AHEADS[key] !== TYPE_AHEADS?.ProductionTime
    )
      types[key] = [`${typeAheads[key].Value}`];
  });
  return types;
}

function getNumericFilters(
  pTime: ProductionTimeItem,
  rushTime?: boolean
): Array<NumericFilter> {
  const prTime: Array<NumericFilter> = [];
  if (pTime?.Value) {
    const time = parseInt(pTime.Value.match(/\d+/)[0]);

    prTime.push({
      Name: rushTime ? 'ProductionRushTime' : 'ProductionTime',
      To: time,
    });
  }

  return prTime;
}

function getExcludeTermsFormatted(terms?: string): string {
  if (!terms?.length) return terms;

  terms = terms.replace(/\s+/g, ',');
  const cleanTerms = terms.split(',').filter((val) => {
    return val?.length;
  });

  return cleanTerms?.join(', ');
}

//-------------------------------------------------------------------------------------------------------
// @Public Functions
//---------------------------------------------------------------------------------------------------------

export type SearchCriteriaFilters = Pick<
  ProductSearchCriteria,
  'excludeTerm' | 'filters' | 'numericFilters' | 'priceFilter'
>;

export function excludeTermsFn(criteria: ProductSearchCriteria): string {
  const value = criteria.excludeTerm;

  return value ? `Exclude: ${value}` : 'Exclude';
}

export function mapSearchCriteriaToUrlFilters(
  criteria: ProductSearchCriteria
): UrlFilters {
  const checked = Object.entries(criteria.filters)
    .filter(
      ([key, value]) =>
        CHECK_BOXES.find((cb) => cb.value === key) &&
        Array.isArray(value?.terms) &&
        Boolean(value?.terms[0]) === true
    )
    .map(([key]) => key);

  const productionRushTime = criteria.numericFilters?.find(
    (value) => value.Name === 'ProductionRushTime'
  );

  if (productionRushTime) {
    checked.push('IncludeRushTime');
  }

  const rating = criteria.numericFilters?.find(
    (filter) => filter.Name === 'SupplierRating'
  )?.From;

  const price = Object.entries(criteria.priceFilter)
    .filter(([_, v]) => v > 0)
    .map(([k, v]) => [k.toLowerCase(), v]);
  const values = {
    category: criteria.filters?.CategoryValue?.terms,
    categoryGroup: criteria.filters?.CategoryGroup?.terms,
    color: criteria.filters?.Color?.terms,
    exclude: criteria.excludeTerm,
    imprintMethod: criteria.filters?.ImprintMethod?.terms,
    linename: criteria.filters?.LineName?.terms,
    material: criteria.filters?.Material?.terms,
    productionTime: criteria.numericFilters?.find(
      (value) =>
        value.Name === 'ProductionTime' || value.Name === 'ProductionRushTime'
    )?.To,
    rating,
    shape: criteria.filters?.Shape?.terms,
    size: criteria.filters?.Size?.terms,
    supplier: criteria.filters?.Supplier?.terms,
    theme: criteria.filters?.Theme?.terms,
    tradename: criteria.filters?.TradeName?.terms,
  };

  const urlFilters = Object.fromEntries(
    Object.entries(values).filter(([_, v]) => v != null)
  );

  if (checked.length) {
    Object.assign(urlFilters, {
      checked,
    });
  }

  if (price.length) {
    Object.assign(urlFilters, {
      price: Object.fromEntries(price),
    });
  }

  return urlFilters;
}

export function mapUrlFiltersToFiltersForm(filters: UrlFilters): FiltersForm {
  const mapAggregateValue = (value: string[]) =>
    value?.[0] ? { Value: value?.[0] } : undefined;

  return {
    CategoryGroup: filters?.categoryGroup?.[0],
    CategoryValue: filters?.category,
    Color: filters?.color,
    ExcludeTerms: filters?.exclude ?? null,
    Supplier: filters?.supplier,
    SupplierRating: filters?.rating?.toString(),
    CheckBoxes: Object.fromEntries(
      filters?.checked
        ?.filter((key) => key !== 'IncludeRushTime')
        ?.map((key) => [key, true]) ?? []
    ),
    PriceFilter: {
      From: filters?.price?.from ?? null,
      To: filters?.price?.to ?? null,
      Quantity: filters?.price?.quantity ?? null,
    },
    TypeAheads: {
      ImprintMethod: mapAggregateValue(filters?.imprintMethod),
      LineName: mapAggregateValue(filters?.linename),
      Material: mapAggregateValue(filters?.material),
      Shape: mapAggregateValue(filters?.shape),
      Size: mapAggregateValue(filters?.size),
      Theme: mapAggregateValue(filters?.theme),
      TradeName: mapAggregateValue(filters?.tradename),
      ProductionTime: filters?.productionTime
        ? {
            Value: `${filters?.productionTime.toString()} day${
              filters?.productionTime === 1 ? '' : 's'
            }`,
          }
        : undefined,
    },
    IncludeRushTime: filters?.checked?.includes('IncludeRushTime'),
  };
}

export function mapFiltersFormToSearchCriteria(
  form: FiltersForm
): SearchCriteriaFilters {
  const numericFilters: NumericFilter[] = [];
  const typeAheads = getTypeAHeadValues(form.TypeAheads);

  const checkboxes = Object.fromEntries(
    Object.entries(form.CheckBoxes ?? {})
      .filter(([key, checked]) => checked === true)
      .map(([key]) => [key, { terms: [true] }])
  );

  const productionTime: NumericFilter[] = getNumericFilters(
    form.TypeAheads.ProductionTime,
    form.IncludeRushTime
  );

  if (form.SupplierRating) {
    numericFilters.push({
      Name: 'SupplierRating',
      From: parseInt(form.SupplierRating),
    });
  }

  if (productionTime) {
    numericFilters.push(...productionTime);
  }

  const facetFilters = {};

  if (form.CategoryGroup?.length) {
    Object.assign(facetFilters, {
      CategoryGroup: { terms: coerceArray(form.CategoryGroup) },
    });

    if (form.CategoryValue?.length) {
      Object.assign(facetFilters, {
        CategoryValue: { terms: form.CategoryValue },
      });
    }
  }

  if (form.Color?.length) {
    Object.assign(facetFilters, {
      Color: { terms: [...form.Color] },
    });
  }

  if (form.Supplier?.length) {
    Object.assign(facetFilters, {
      Supplier: { terms: [...form.Supplier] },
    });
  }

  if (Object.keys(typeAheads)?.length > 0) {
    Object.keys(typeAheads).forEach((key) => {
      Object.assign(facetFilters, {
        [key]: { terms: typeAheads[key] },
      });
    });
  }

  if (Object.keys(checkboxes)?.length > 0) {
    Object.assign(facetFilters, {
      ...checkboxes,
    });
  }

  return {
    excludeTerm: getExcludeTermsFormatted(form.ExcludeTerms),
    filters: facetFilters,
    numericFilters: numericFilters,
    priceFilter: form.PriceFilter,
  };
}

export function getFilterLabel(
  filterValue: string[] | number[],
  labelSingular: string,
  labelPlural: string
): string {
  const len = filterValue?.length || 0;

  if (len > 1) {
    return `${filterValue.length} ${labelPlural}`;
  }

  return len === 1 ? filterValue[0].toString() : labelSingular;
}

export function getTypeAheadCount(
  typeAheads: TypeAheads<AggregateValue>
): number {
  return Object.keys(typeAheads).filter(
    (key: string) => typeAheads?.[key]?.Value?.length > 0
  ).length;
}

export function getCheckBoxCount(checkBoxes: {
  [key: string]: boolean;
}): number {
  return CHECK_BOXES.filter((v) => checkBoxes[v.value]).length;
}

export function getProductionTimeValues(): AggregateValue[] {
  const start = 1;
  const end = 120;
  const dummyValues: AggregateValue[] = [];

  for (let i = start; i <= end; i++) {
    const item: AggregateValue = {
      ...FILTERS_FORM_DEFAULT.TypeAheads.ProductionTime,
    };

    item.Value = `${i} day${i === 1 ? '' : 's'}`;

    dummyValues.push(item);
  }
  return dummyValues;
}

export function formControlClickOut(
  controlName: string,
  _filtersForm: FormGroup,
  criteria: ProductSearchCriteria
) {
  switch (controlName) {
    case SearchFormKeys.PriceFilter: {
      const appliedPriceFilter = criteria?.priceFilter ?? {};
      Object.keys(appliedPriceFilter).length > 0
        ? _filtersForm.get(controlName).setValue(appliedPriceFilter)
        : _filtersForm
            .get(controlName)
            ?.reset(FILTERS_FORM_DEFAULT.PriceFilter);
      break;
    }
    case SearchFormKeys.SupplierRating: {
      const numericFilters: NumericFilter[] = criteria?.numericFilters;

      const rating = numericFilters.find((f) => f.Name === 'SupplierRating');

      _filtersForm
        .get(controlName)
        .setValue(rating?.From || FILTERS_FORM_DEFAULT.SupplierRating);

      break;
    }
    case SearchFormKeys.ExcludeTerms:
      criteria.excludeTerm?.length
        ? _filtersForm.get(controlName).setValue(criteria.excludeTerm)
        : _filtersForm
            .get(controlName)
            .reset(FILTERS_FORM_DEFAULT.ExcludeTerms);
      break;
    default: {
      criteria.filters[controlName]?.terms?.length
        ? _filtersForm
            .get(controlName)
            .setValue(criteria.filters[controlName].terms)
        : _filtersForm
            .get(controlName)
            .reset(FILTERS_FORM_DEFAULT[controlName]);
      break;
    }
  }
}

export function priceFn(criteria: ProductSearchCriteria): string {
  const price = criteria.priceFilter;

  const min = price?.From ? `$${Number(price.From).toFixed(2)}` : null;
  const max = price?.To ? `$${Number(price.To).toFixed(2)}` : null;

  if (min && !max) {
    return `${min}+`;
  }

  if (!min && max) {
    return `Up to ${max}`;
  }

  if (min && max) {
    return min === max ? min : `${min} - ${max}`;
  }

  return 'Price Per Unit';
}

export function quantityFn(criteria: ProductSearchCriteria): string {
  const value = criteria?.priceFilter?.Quantity;
  return value ? `Quantity: ${value}` : 'Quantity';
}

export function ratingFn(criteria: ProductSearchCriteria): string {
  const rating = criteria.numericFilters?.find(
    (filter) => filter.Name === 'SupplierRating'
  );
  const mappedRating = supplierRatings.filter(
    (v) => v.value === rating?.From
  )[0]?.name;

  return mappedRating || 'All Ratings';
}

export function removeFormFilter(
  filtersForm: FormGroup,
  controlName: string,
  value?: string
): void {
  if (!(controlName && filtersForm)) return;
  switch (controlName) {
    case SearchFormKeys.CategoryGroup:
      filtersForm.patchValue({
        CategoryGroup: FILTERS_FORM_DEFAULT['CategoryGroup'],
        CategoryValue: FILTERS_FORM_DEFAULT['CategoryValue'],
      });
      break;
    case SearchFormKeys.Quantity:
      filtersForm.get('PriceFilter.Quantity').reset(null);
      break;
    case SearchFormKeys.PriceFilter:
      filtersForm.get('PriceFilter.To').reset(null);
      filtersForm.get('PriceFilter.From').reset(null);
      break;
    case SearchFormKeys.TypeAheads:
    case SearchFormKeys.CheckBoxes:
      filtersForm.get(controlName).value[value] = null;
      break;
    case SearchFormKeys.ExcludeTerms:
      if (filtersForm.get(controlName).value?.length) {
        const words = filtersForm.get(controlName).value.split(',');
        words.splice(words.indexOf(value), 1);
        filtersForm.get(controlName).setValue(words.join(', '));
      }
      break;
    default:
      if (isArray(filtersForm.get(controlName).value)) {
        const val = [...filtersForm.get(controlName).value];
        val.splice(val.indexOf(value), 1);
        filtersForm.get(controlName).setValue(val);
      } else {
        filtersForm.get(controlName).reset(null);
      }
      break;
  }
}
