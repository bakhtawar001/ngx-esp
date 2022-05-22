import { Injectable, OnDestroy } from '@angular/core';
import {
  asDispatch,
  fromSelector,
  LocalState,
  stringQueryParamConverter,
  urlQueryParameter,
} from '@cosmos/state';
import {
  mapSearchCriteriaToUrlFilters,
  SupplierSearchActions,
  SupplierSearchCriteria,
  SupplierSearchQueries,
  UrlFilters,
} from '@esp/suppliers';

@Injectable()
export class SupplierSearchLocalState
  extends LocalState<SupplierSearchLocalState>
  implements OnDestroy
{
  pageSize = 48;

  index = fromSelector(SupplierSearchQueries.getIndex);
  queryId = fromSelector(SupplierSearchQueries.getQueryId);

  private _search = asDispatch(SupplierSearchActions.Search);
  criteria = fromSelector(SupplierSearchQueries.getCriteria);
  results = fromSelector(SupplierSearchQueries.getResults);
  hasLoaded = fromSelector(SupplierSearchQueries.hasLoaded);
  isLoading = fromSelector(SupplierSearchQueries.isLoading);
  resetLoading = asDispatch(SupplierSearchActions.ResetLoading);

  from = urlQueryParameter<number>('page', {
    defaultValue: 1,
    debounceTime: 0,
    converter: {
      fromQuery: (queryParameterValues: string[], defaultValue: number) =>
        queryParameterValues.length > 0
          ? parseInt(queryParameterValues[0], 10)
          : defaultValue,
      toQuery: (value: number) => (value > 1 ? [value.toString()] : []),
    },
  });

  sort = urlQueryParameter<string>('sort', {
    defaultValue: '',
    debounceTime: 0,
    converter: stringQueryParamConverter,
  });

  term = urlQueryParameter<string>('q', {
    defaultValue: '',
    debounceTime: 0,
    converter: stringQueryParamConverter,
  });

  filters = urlQueryParameter<UrlFilters>('filters', {
    defaultValue: {},
    debounceTime: 0,
    converter: {
      fromQuery: (queryParameterValues: string[], defaultValue: UrlFilters) => {
        return queryParameterValues.length > 0
          ? JSON.parse(decodeURIComponent(queryParameterValues[0]))
          : defaultValue;
      },
      toQuery: (value: UrlFilters) => {
        const values = value
          ? Object.entries(value).filter(([_, v]) => v != null)
          : [];
        return values?.length
          ? [encodeURIComponent(JSON.stringify(Object.fromEntries(values)))]
          : [];
      },
    },
  });

  get pageIndex() {
    return this.criteria.from - 1;
  }

  get suppliers() {
    return this.results?.Results;
  }

  search(criteria: SupplierSearchCriteria) {
    this._search(criteria);

    if (!criteria?.aggregationsOnly) {
      this.filters = mapSearchCriteriaToUrlFilters(criteria);
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.resetLoading();
  }
}
