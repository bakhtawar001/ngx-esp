import { SearchCriteria, SearchResult } from '@esp/models';

export interface SearchStateModel<T, S = any> {
  criteria?: SearchCriteria;
  result?: SearchResult<T, S> | null;
}
