import { Injectable } from '@angular/core';
import { ModelWithLoadingStatus, syncLoadProgress } from '@cosmos/state';
import { OrderSearch } from '@esp/models';
import type { SearchStateModel } from '@esp/search';
import { Navigate } from '@ngxs/router-plugin';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { finalize, tap } from 'rxjs/operators';
import { OrdersSearchActions } from '../actions';
import { OrdersService } from '../services/orders.service';

export interface OrdersSearchStateModel
  extends SearchStateModel<OrderSearch>,
    ModelWithLoadingStatus {
  creatingOrder: boolean;
}

type LocalStateContext = StateContext<OrdersSearchStateModel>;

@State<OrdersSearchStateModel>({
  name: 'ordersSearch',
  defaults: {
    creatingOrder: false,
  },
})
@Injectable()
export class OrdersSearchState {
  constructor(private service: OrdersService) {}

  @Action(OrdersSearchActions.Search)
  search(ctx: LocalStateContext, { criteria }: OrdersSearchActions.Search) {
    ctx.patchState({
      criteria,
      result: null,
    });

    return this.service.query<OrderSearch>(criteria).pipe(
      syncLoadProgress(ctx),
      tap((result) => ctx.patchState({ result }))
    );
  }

  @Action(OrdersSearchActions.CreateOrder)
  createOrder(
    ctx: LocalStateContext,
    { order }: OrdersSearchActions.CreateOrder
  ) {
    ctx.patchState({ creatingOrder: true });
    return this.service.create(order).pipe(
      tap((order) => {
        if (order.ProjectId) {
          return ctx.dispatch(
            new Navigate(['/projects', order.ProjectId, 'orders', order.Id])
          );
        }

        ctx.dispatch(new Navigate(['/orders', order.Id]));
      }),
      finalize(() => ctx.patchState({ creatingOrder: false }))
    );
  }
}
