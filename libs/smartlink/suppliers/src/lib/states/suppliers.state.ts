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
import { tap } from 'rxjs/operators';
import { SupplierActions } from '../actions';
import { SupplierView } from '../models';
import { SuppliersService } from '../services';

const ACCEPTABLE_CACHE_SIZE = 5 as const;

namespace InternalActions {
  const ACTION_SCOPE = '[Smartlink Supplier]';

  export class Load {
    static readonly type = `${ACTION_SCOPE} Load`;

    constructor(public id: number) {}
  }

  export class LoadRatings {
    static type = `${ACTION_SCOPE} Load Ratings`;

    constructor(public id: number) {}
  }
}

export interface SuppliersStateModel
  extends EntityStateModel<SupplierView>,
    ModelWithLoadingStatus {}

type ThisStateContext = StateContext<SuppliersStateModel>;

@State<SuppliersStateModel>({
  name: 'suppliers',
  defaults: {
    items: {},
    itemIds: [],
    currentId: null,
  },
})
@Injectable()
export class SuppliersState {
  constructor(private service: SuppliersService) {}

  @Action(SupplierActions.SelectSupplier)
  private selectSupplier(
    ctx: ThisStateContext,
    { supplierId }: SupplierActions.SelectSupplier
  ) {
    ctx.setState(
      patch<SuppliersStateModel>({
        currentId: supplierId,
        itemIds: insertItem(supplierId, 0),
      })
    );

    return ctx
      .dispatch([
        new InternalActions.Load(supplierId),
        new InternalActions.LoadRatings(supplierId),
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
    return this.service
      .get(id)
      .pipe(
        tap((supplier) => ctx.setState(setEntityStateItem(id, { supplier })))
      );
  }

  @Action(InternalActions.LoadRatings)
  private loadInventory(
    ctx: ThisStateContext,
    { id }: InternalActions.LoadRatings
  ) {
    return this.service
      .getRatings(id, { include_comments: true })
      .pipe(
        tap((ratings) => ctx.setState(setEntityStateItem(id, { ratings })))
      );
  }
}
