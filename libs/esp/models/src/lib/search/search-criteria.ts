import { Dictionary } from '@cosmos/core';

export type CommaSeperatedStringValues = string;

export class SearchCriteria {
  excludeList?: CommaSeperatedStringValues;
  filters?: Dictionary<SearchFilter>;
  from = 1;
  id?: number;
  size = 50;
  sortBy?: Dictionary<string> | string;
  status?: string;
  term?: any;
  type?: string;
  letter?: string;
  editOnly?: boolean;

  constructor(options?: Partial<SearchCriteria>) {
    Object.assign(this, options);
  }
}

export interface SearchFilter {
  behavior?: string;
  terms: string[] | number[];
}
