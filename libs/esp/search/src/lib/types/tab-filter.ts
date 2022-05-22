import { SearchCriteria } from '@esp/models';

export interface TabFilter {
  name: string;
  criteria: Partial<SearchCriteria>;
  cssClass?: string;
}
