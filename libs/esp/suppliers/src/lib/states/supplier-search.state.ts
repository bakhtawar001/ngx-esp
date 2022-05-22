import { Injectable } from '@angular/core';
import { ModelWithLoadingStatus, syncLoadProgress } from '@cosmos/state';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { SupplierSearchResultItem } from '@smartlink/suppliers';
import { KeywordSuggestions } from 'libs/smartlink/models/src/lib/products';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SupplierSearchActions } from '../actions';
import { DEFAULT_SEARCH_CRITERIA } from '../constants';
import { SearchResult, SupplierSearchCriteria } from '../models';
import { SuppliersService } from '../services';

export interface SupplierSearchStateModel extends ModelWithLoadingStatus {
  criteria?: SupplierSearchCriteria;
  results?: SearchResult<SupplierSearchResultItem>;
  keywordSuggestions?: KeywordSuggestions[];
}

type LocalStateContext = StateContext<SupplierSearchStateModel>;

const defaultState = (): SupplierSearchStateModel => ({
  criteria: DEFAULT_SEARCH_CRITERIA,
});

@State<SupplierSearchStateModel>({
  name: 'supplierSearch',
  defaults: defaultState(),
})
@Injectable()
export class SupplierSearchState {
  constructor(private readonly service: SuppliersService) {}

  @Action(SupplierSearchActions.Search)
  private search(
    ctx: LocalStateContext,
    { criteria }: SupplierSearchActions.Search
  ) {
    ctx.patchState({ criteria, results: null });
    return this.service.search<SupplierSearchResultItem>(criteria).pipe(
      tap((results) => {
        ctx.patchState({ results });
      }),
      syncLoadProgress(ctx)
    );
  }

  @Action(SupplierSearchActions.LoadKeywordSuggestions)
  loadKeywordSuggestions(
    ctx: LocalStateContext,
    { params }: SupplierSearchActions.LoadKeywordSuggestions
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

  @Action(SupplierSearchActions.ResetLoading)
  private resetLoading(ctx: LocalStateContext) {
    ctx.patchState({
      loading: null,
    });
  }
}
