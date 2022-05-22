import { SearchFilter } from '@esp/models';
import { Dictionary } from '@cosmos/core';

export interface CompanySearchFilters extends Dictionary<SearchFilter> {
  Owners?: SearchFilter;
}
