import { SearchFilter } from '@esp/models';
import { Dictionary } from '@cosmos/core';

export interface ProjectSearchFilters extends Dictionary<SearchFilter> {
  Owners?: SearchFilter;
  InHandsDate?: SearchFilter;
  EventDate?: SearchFilter;
  StepName?: SearchFilter;
}
