import { Injectable } from '@angular/core';
import { ModelWithLoadingStatus, syncLoadProgress } from '@cosmos/state';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { KeywordSuggestions, ProductSearchResultItem } from '@smartlink/models';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProductSearchActions } from '../actions';
import { DEFAULT_SEARCH_CRITERIA } from '../constants';
import { ProductsService } from '../services';
import {
  AggregateValue,
  Aggregations,
  ProductSearchCriteria,
  SearchResult,
} from '../types';

export interface ProductSearchStateModel extends ModelWithLoadingStatus {
  criteria?: ProductSearchCriteria;
  results?: SearchResult<ProductSearchResultItem>;
  facets?: Aggregations;
  keywordSuggestions?: KeywordSuggestions[];
}

type LocalStateContext = StateContext<ProductSearchStateModel>;

const defaultState = (): ProductSearchStateModel => ({
  criteria: DEFAULT_SEARCH_CRITERIA,
  facets: {},
});

@State<ProductSearchStateModel>({
  name: 'productSearch',
  defaults: defaultState(),
})
@Injectable()
export class ProductSearchState {
  constructor(private readonly service: ProductsService) {}

  @Action(ProductSearchActions.Search)
  private search(
    ctx: LocalStateContext,
    { criteria }: ProductSearchActions.Search
  ) {
    if (!criteria?.aggregationsOnly) {
      ctx.patchState({ criteria, results: null });
    }

    return this.service.search<ProductSearchResultItem>(criteria).pipe(
      tap((results) => {
        ctx.patchState(
          criteria?.aggregationsOnly
            ? { facets: results.Aggregations }
            : { results, facets: results.Aggregations }
        );
      }),
      syncLoadProgress(ctx)
    );
  }

  @Action(ProductSearchActions.FacetSearch)
  private facetSearch(
    ctx: LocalStateContext,
    { criteria }: ProductSearchActions.FacetSearch
  ) {
    return this.service.facetSearch(criteria).pipe(
      tap((facet: AggregateValue[]) => {
        const facetName = criteria.aggregationName;
        if (facetName)
          ctx.setState(
            patch({
              facets: patch<Aggregations>({
                [facetName]: facet,
              }),
            })
          );
      })
    );
  }

  @Action(ProductSearchActions.LoadKeywordSuggestions)
  loadKeywordSuggestions(
    ctx: LocalStateContext,
    { params }: ProductSearchActions.LoadKeywordSuggestions
  ): Observable<KeywordSuggestions[]> | void {
    if (!params.prefix || params.prefix.length < 3) {
      ctx.patchState({
        keywordSuggestions: [],
      });
    } else {
      return this.service.getKeywordSuggestions(params).pipe(
        tap((results) => {
          ctx.patchState({
            keywordSuggestions: results,
          });
        })
      );
    }
  }

  @Action(ProductSearchActions.ResetLoading)
  private resetLoading(ctx: LocalStateContext) {
    ctx.patchState({
      loading: null,
    });
  }
}
