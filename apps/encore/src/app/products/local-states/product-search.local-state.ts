import { Injectable, OnDestroy } from '@angular/core';
import {
  asDispatch,
  fromSelector,
  stringQueryParamConverter,
  urlQueryParameter,
} from '@cosmos/state';
import {
  mapSearchCriteriaToUrlFilters,
  ProductSearchActions,
  ProductSearchCriteria,
  ProductSearchQueries,
  UrlFilters,
} from '@esp/products';
import { SearchFilterLocalState } from '@esp/search';

@Injectable()
export class ProductSearchLocalState
  extends SearchFilterLocalState<ProductSearchLocalState>
  implements OnDestroy
{
  pageSize = 48;

  index = fromSelector(ProductSearchQueries.getIndex);
  queryId = fromSelector(ProductSearchQueries.getQueryId);

  facetSearch = asDispatch(ProductSearchActions.FacetSearch);
  private _search = asDispatch(ProductSearchActions.Search);
  criteria = fromSelector(ProductSearchQueries.getCriteria);
  filterPills = fromSelector(ProductSearchQueries.getFilterPills);
  results = fromSelector(ProductSearchQueries.getResults);
  override facets = fromSelector(ProductSearchQueries.getFacets);
  hasLoaded = fromSelector(ProductSearchQueries.hasLoaded);
  isLoading = fromSelector(ProductSearchQueries.isLoading);
  resetLoading = asDispatch(ProductSearchActions.ResetLoading);

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

  get products() {
    return this.results?.Results;
  }

  search(criteria: ProductSearchCriteria) {
    this._search(criteria);

    if (!criteria?.aggregationsOnly) {
      // TODO: this.filters should be updated by this.criteria changes.
      this.filters = mapSearchCriteriaToUrlFilters(criteria);
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.resetLoading();
  }
}
