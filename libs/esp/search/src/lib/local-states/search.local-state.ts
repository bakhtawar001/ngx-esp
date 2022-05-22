import { Injectable, InjectionToken } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { LocalState, stateBehavior } from '@cosmos/state';
import { isEqual } from 'lodash-es';
import { animationFrameScheduler, defer } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMapTo,
  tap,
} from 'rxjs/operators';
import type { SortOption, TabFilter } from '../types';
import { Dictionary } from '@cosmos/core';
import { SearchCriteria, SearchFilter } from '@esp/models';

export const SEARCH_LOCAL_STATE = new InjectionToken<SearchLocalState>(
  'ESP Search Local State'
);

export interface SearchLocalState<T extends object = any> {
  tab?: TabFilter;
  tabIndex?: number;
  term?: string;
  filters?: Dictionary<SearchFilter>;

  setTab?(event: MatTabChangeEvent): void;

  sort?: SortOption;
}

@Injectable()
export abstract class SearchLocalState<
  T extends object = any
> extends LocalState<T> {
  abstract search(criteria: SearchCriteria): void;

  abstract criteria: SearchCriteria;
  abstract total: number;
  abstract from: number;

  private _searchOnChanges = stateBehavior<SearchLocalState<T>>((state$) =>
    // The `tab` property is defined within the child class, e.g. within the `CompanySearchLocalState`.
    // We can't call `_searchStateMapper()` immediately before the child class is initialized, since child
    // class properties are not initialized yet.
    defer(() => Promise.resolve()).pipe(
      switchMapTo(
        state$.pipe(
          map((state) => this._searchStateMapper(state)),
          debounceTime(0, animationFrameScheduler),
          distinctUntilChanged(isEqual),
          tap((criteria) =>
            this.search({
              ...this.criteria,
              ...criteria,
            })
          )
        )
      )
    )
  );

  protected _searchStateMapper(state: SearchLocalState<T>) {
    return {
      ...state.tab?.criteria,
      term: state.term ?? '',
      from: state.from,
      sortBy: state.sort?.value,
      filters: {
        ...state.filters,
        ...state.tab?.criteria.filters,
      },
    };
  }
}
