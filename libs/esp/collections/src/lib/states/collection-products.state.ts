import { Injectable } from '@angular/core';
import { ToastActions } from '@cosmos/components/notification';
import { ModelWithLoadingStatus, syncLoadProgress } from '@cosmos/state';
import { SearchCriteria, SearchResult } from '@esp/models';
import { SearchStateModel } from '@esp/search';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  CollectionProductsActions,
  CollectionsActions,
  RecentCollectionsActions,
} from '../actions';
import { CollectionProductSearchResultItem } from '../models';
import { CollectionsService } from '../services/collections.service';

export interface CollectionProductsStateModel
  extends SearchStateModel<CollectionProductSearchResultItem>,
    ModelWithLoadingStatus {
  products: SearchResult<CollectionProductSearchResultItem>;
  total: number;
}

type ThisStateContext = StateContext<CollectionProductsStateModel>;

const defaultState = () => ({
  loading: null,
  products: null!,
  total: 0,
  criteria: new SearchCriteria({ size: 48 }),
});

@State<CollectionProductsStateModel>({
  name: 'collectionProducts',
  defaults: defaultState(),
})
@Injectable()
export class CollectionProductsState {
  constructor(private readonly service: CollectionsService) {}

  @Action(CollectionProductsActions.Remove)
  private delete(
    ctx: ThisStateContext,
    { id, productIds }: CollectionProductsActions.Remove
  ) {
    const { products } = ctx.getState();

    if (products) {
      const filteredProducts = products.Results?.filter(
        (product) => !productIds.includes(product.Id!)
      );

      ctx.setState(
        patch({
          products: patch({
            Results: filteredProducts,
            ResultsTotal: Math.max(
              products.ResultsTotal! - productIds.length,
              0
            ),
          }),
        })
      );
    }

    return this.service.removeProducts(id, productIds).pipe(
      tap(() => {
        ctx.dispatch([
          new RecentCollectionsActions.Get(),
          new CollectionProductsActions.RemoveSuccess(id, productIds),
          new ToastActions.Show({
            title: 'Success!',
            body: `${productIds.length} product${
              productIds.length > 1 ? 's' : ''
            } deleted.`,
            type: 'confirm',
          }),
        ]);
      }),
      catchError(() => {
        ctx.dispatch(
          new ToastActions.Show({
            title: 'Error!',
            body: 'Product(s) not deleted.',
            type: 'error',
          })
        );

        ctx.setState(patch({ products }));

        return EMPTY;
      })
    );
  }

  @Action(CollectionProductsActions.Search)
  search(
    ctx: ThisStateContext,
    { id, criteria }: CollectionProductsActions.Search
  ) {
    ctx.patchState({
      criteria,
      products: null,
      total: 0,
    });

    return this.service.searchProducts(id, criteria).pipe(
      syncLoadProgress(ctx),

      tap((products) =>
        ctx.patchState({
          products,
          total: products.ResultsTotal || 0,
        })
      )
    );
  }

  @Action(CollectionsActions.Get)
  get(ctx: ThisStateContext, { id }: CollectionsActions.Get) {
    ctx.setState(defaultState());
  }
}
