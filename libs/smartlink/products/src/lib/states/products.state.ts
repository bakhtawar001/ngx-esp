import { Injectable } from '@angular/core';
import {
  EntityStateModel,
  ModelWithLoadingStatus,
  pruneCache,
  setEntityStateItem,
  syncLoadProgress,
} from '@cosmos/state';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { insertItem, patch } from '@ngxs/store/operators';
import { EMPTY } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { ProductActions } from '../actions';
import { ProductView } from '@smartlink/models';
import { ProductsService } from '../services';

const ACCEPTABLE_CACHE_SIZE = 5 as const;

namespace InternalActions {
  const ACTION_SCOPE = '[Smartlink Product]';

  export class Load {
    static readonly type = `${ACTION_SCOPE} Load`;

    constructor(public id: number) {}
  }

  export class LoadInventory {
    static type = `${ACTION_SCOPE} Load Inventory`;

    constructor(public id: number) {}
  }

  export class LoadMedia {
    static readonly type = `${ACTION_SCOPE} Load Media`;

    constructor(public id: number, public options?: { type: string }) {}
  }
}

export interface ProductsStateModel
  extends EntityStateModel<ProductView>,
    ModelWithLoadingStatus {}

type ThisStateContext = StateContext<ProductsStateModel>;

@State<ProductsStateModel>({
  name: 'products',
  defaults: {
    items: {},
    itemIds: [],
    currentId: null,
  },
})
@Injectable()
export class ProductsState {
  constructor(private service: ProductsService) {}

  @Action(ProductActions.SelectProduct)
  private selectProduct(
    ctx: ThisStateContext,
    { productId }: ProductActions.SelectProduct
  ) {
    ctx.setState(
      patch<ProductsStateModel>({
        currentId: productId,
        itemIds: insertItem(productId, 0),
      })
    );

    return ctx
      .dispatch([
        new InternalActions.Load(productId),
        new InternalActions.LoadInventory(productId),
        // new InternalActions.LoadMedia(productId, { type: 'VD' }),
      ])
      .pipe(
        tap(() => {
          ctx.setState(pruneCache(ACCEPTABLE_CACHE_SIZE));
        }),
        syncLoadProgress(ctx)
      );
  }

  @Action(InternalActions.Load)
  private load(ctx: ThisStateContext, { id }: InternalActions.Load) {
    return this.service.get(id).pipe(
      tap((product) => ctx.setState(setEntityStateItem(id, { product }))),
      mergeMap((product) => {
        if (product.HasVideo) {
          return ctx.dispatch(
            new InternalActions.LoadMedia(id, { type: 'VD' })
          );
        }

        return EMPTY;
      })
    );
  }

  @Action(InternalActions.LoadInventory)
  private loadInventory(
    ctx: ThisStateContext,
    { id }: InternalActions.LoadInventory
  ) {
    return this.service
      .getProductInventory(id)
      .pipe(
        tap((inventory) => ctx.setState(setEntityStateItem(id, { inventory })))
      );
  }

  @Action(InternalActions.LoadMedia)
  private loadMedia(
    ctx: ThisStateContext,
    { id, options }: InternalActions.LoadMedia
  ) {
    return this.service
      .getProductMedia(id, options)
      .pipe(tap((media) => ctx.setState(setEntityStateItem(id, { media }))));
  }
}
