import { Injectable } from '@angular/core';
import { ModelWithLoadingStatus } from '@cosmos/state';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProductSearchActions } from '../actions';
import { KeywordSuggestions } from '@smartlink/models';
import { ProductsService } from '../services';

export interface ProductSearchStateModel extends ModelWithLoadingStatus {
  keywordSuggestions: KeywordSuggestions[] | null;
}

type ThisStateContext = StateContext<ProductSearchStateModel>;

@State<ProductSearchStateModel>({
  name: 'smartlinkProductSearch',
  defaults: {
    keywordSuggestions: null,
  },
})
@Injectable()
export class ProductSearchState {
  constructor(private readonly service: ProductsService) {}

  @Action(ProductSearchActions.LoadKeywordSuggestions)
  loadKeywordSuggestions(
    ctx: ThisStateContext,
    event: ProductSearchActions.LoadKeywordSuggestions
  ): Observable<unknown> | void {
    if (!event.params.prefix || event.params.prefix.length < 3) {
      ctx.patchState({ keywordSuggestions: null });
    } else {
      return this.service.getKeywordSuggestions(event.params).pipe(
        tap((keywordSuggestions: KeywordSuggestions[]) =>
          ctx.patchState({
            keywordSuggestions,
          })
        )
      );
    }
  }
}
