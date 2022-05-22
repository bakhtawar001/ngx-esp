import { Injectable, InjectionToken } from '@angular/core';
import { LocalState } from '@cosmos/state';
import { Observable } from 'rxjs';
import { TypeAheadSearchCriteria } from '@esp/products';

export const SEARCH_FILTER_LOCAL_STATE =
  new InjectionToken<SearchFilterLocalState>('ESP Search Filter Local State');

@Injectable()
export abstract class SearchFilterLocalState<
  T extends object = any
> extends LocalState<T> {
  abstract facetSearch(criteria: TypeAheadSearchCriteria): Observable<void>;
  facets: any; // @TODO: verify if can find and overlapping interface for all possible facet, otherwise let it's come from Generic.
}
