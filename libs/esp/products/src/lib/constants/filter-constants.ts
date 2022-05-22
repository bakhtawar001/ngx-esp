import {
  AggregateValue,
  NumericFilter,
  TypeAheadSearchCriteria,
} from '../types';

interface CheckboxFilter {
  label: string;
  value: string;
}

export interface ProductionTimeItem {
  Value: string;
  Count?: number;
}

export const TYPE_AHEADS: { [key: string]: string } = {
  Material: 'Material',
  Size: 'Size',
  Theme: 'Theme',
  TradeName: 'Tradename',
  ImprintMethod: 'Imprint',
  Shape: 'Shape',
  LineName: 'Linename',
  ProductionTime: 'Production Time',
};

export interface CurrentFilterSet {
  aggregation: TypeAheadSearchCriteria;
  filters: AggregateValue[];
}

export interface MapFilters {
  checkBoxes: { [key: string]: [boolean] };
  numericFilters: Array<NumericFilter>;
}

export const CHECK_BOXES: Array<CheckboxFilter> = [
  { label: 'New Products', value: 'IsNew' },
  { label: 'With Specials', value: 'HasSpecial' },
  { label: 'Union Affiliated', value: 'IsUnionAffiliated' },
  { label: 'No Hazardous Material', value: 'NoHazardMaterials' },
  { label: 'Made in the USA', value: 'MadeInUsa' },
  { label: 'Full Color Process', value: 'HasFullColorProcess' },
  { label: 'Minority Owned', value: 'IsMinorityOwned' },
  { label: 'No Choking Hazards', value: 'NoChokingHazards' },
  { label: 'Confirmed', value: 'IsConfirmed' },
  { label: 'Personalization', value: 'HasPersonalization' },
  { label: 'Contains PROP 65 Warnings', value: 'HasProp65Warnings' },
  { label: 'With Videos', value: 'HasProductVideo' },
  { label: 'With Rush Service', value: 'HasRushService' },
  { label: 'Sold Unimprinted', value: 'HasUnimprinted' },
  { label: 'Without PROP 65 Warnings', value: 'NoProp65Warnings' },
];

export const DEFAULT_SEARCH_CRITERIA = {
  excludeTerm: null,
  from: 1,
  filters: {},
  numericFilters: [],
  organicSize: 0,
  priceFilter: {},
  size: 48,
};
