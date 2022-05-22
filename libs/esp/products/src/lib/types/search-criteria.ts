import { SearchCriteria as EspSearchCriteria } from '@esp/models';

export type AggregationTypes =
  | 'CategoryGroup'
  | 'CategoryValue'
  | 'Supplier'
  | 'Color'
  | 'ImprintMethod'
  | 'Size'
  | 'Material'
  | 'Theme'
  | 'TradeName'
  | 'LineName'
  | 'ProductionTime'
  | 'Shape';

export type MarketSegment = 'USALL' | 'CANALL';

export interface SearchKey {
  keywords: string;
  searchType?: string;
}

export interface NumericFilter {
  Name: string;
  To?: number;
  From?: number;
}

export interface PriceFilter {
  Quantity?: number;
  From?: number;
  To?: number;
}

export interface ProductSearchCriteria extends SearchCriteria {
  excludeTerm?: string;
  organicSize?: number;
  priceFilter?: PriceFilter;
  numericFilters?: Array<NumericFilter>;

  aggregationsOnly?: boolean;
  aggregationsToInclude?: Array<AggregationTypes>;
}

export interface TypeAheadSearchCriteria extends ProductSearchCriteria {
  aggregationName: AggregationTypes;
  aggregationQuery: string;
}

export class SearchCriteria extends EspSearchCriteria {
  constructor(options?: Partial<SearchCriteria>) {
    super(options);

    Object.assign(this, options);
  }
}
