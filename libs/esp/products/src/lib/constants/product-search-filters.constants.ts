import { AggregateValue, PriceFilter, TypeAheads } from '../types';

export const supplierRatings = [
  { name: 'All Ratings', value: '' },
  {
    name: '5 stars',
    value: 10,
  },
  {
    name: '4 stars & up',
    value: 8,
  },
  {
    name: '3 stars & up',
    value: 6,
  },
  {
    name: '2 stars & up',
    value: 4,
  },
  {
    name: '1 star & up',
    value: 2,
  },
];

export const DEFAULT_AGGREGATE_VALUE: AggregateValue = {
  Value: '',
  Count: null,
};

export const enum SearchFormKeys {
  PriceFilter = 'PriceFilter',
  ExcludeTerms = 'ExcludeTerms',
  SupplierRating = 'SupplierRating',
  Quantity = 'Quantity',
  TypeAheads = 'TypeAheads',
  CheckBoxes = 'CheckBoxes',
  CategoryGroup = 'CategoryGroup',
}

export interface CurrentAggregateFilters {
  Color: AggregateValue[];
  Supplier: AggregateValue[];
}

export interface FiltersForm {
  CategorySearchTerm?: string;
  SupplierSearchTerm?: string;
  ColorSearchTerm?: string;
  CategoryGroup?: string;
  CategoryValue?: string[];
  Color?: string[];
  Supplier?: string[];
  SupplierRating?: string;
  ExcludeTerms?: string;
  TypeAheads?: TypeAheads<AggregateValue>;
  CheckBoxes?: { [key: string]: boolean };
  IncludeRushTime?: boolean;
  PriceFilter?: PriceFilter;
}

export interface FilterPill {
  ControlName: string;
  Label: string;
  Value?: string;
}

export interface RemoveFilterPayload {
  ControlName?: string;
  Value?: string;
  ClearAll?: boolean;
}

export const DEFAULT_TYPEAHEAD_VALUES = {
  Material: DEFAULT_AGGREGATE_VALUE,
  ImprintMethod: DEFAULT_AGGREGATE_VALUE,
  LineName: DEFAULT_AGGREGATE_VALUE,
  Shape: DEFAULT_AGGREGATE_VALUE,
  Size: DEFAULT_AGGREGATE_VALUE,
  Theme: DEFAULT_AGGREGATE_VALUE,
  TradeName: DEFAULT_AGGREGATE_VALUE,
  ProductionTime: DEFAULT_AGGREGATE_VALUE,
};

export const FILTERS_FORM_DEFAULT: FiltersForm = {
  CategorySearchTerm: '',
  SupplierSearchTerm: '',
  ColorSearchTerm: '',
  CategoryGroup: '',
  CategoryValue: [],
  Supplier: [],
  Color: [],
  SupplierRating: '',
  ExcludeTerms: null,
  TypeAheads: DEFAULT_TYPEAHEAD_VALUES,
  CheckBoxes: {},
  PriceFilter: {},
  IncludeRushTime: false,
};

export const DEFAULT_CURRENT_FILTERS: CurrentAggregateFilters = {
  Color: [],
  Supplier: [],
};
