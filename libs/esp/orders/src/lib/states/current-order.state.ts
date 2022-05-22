import { Injectable } from '@angular/core';
import {
  createPropertySelectors,
  ModelWithLoadingStatus,
  optimisticStateUpdate,
  syncLoadProgress,
} from '@cosmos/state';
import { Order } from '@esp/models';
import { RecentsActions } from '@esp/recently-viewed';
import { Action, State, StateContext } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { OrderActions } from '../actions/order.actions';
import { OrdersService } from '../services/orders.service';

export interface OrderStateModel extends ModelWithLoadingStatus {
  currentOrder: Order | null;
  currentOrderId: number | null;
}

type ThisStateModel = OrderStateModel;
type ThisStateContext = StateContext<ThisStateModel>;

@State<ThisStateModel>({
  name: 'currentOrder',
  defaults: {
    loading: null,
    currentOrder: null,
    currentOrderId: null,
  },
})
@Injectable()
export class CurrentOrderState {
  static readonly props =
    createPropertySelectors<ThisStateModel>(CurrentOrderState);

  constructor(private readonly _service: OrdersService) {}

  @Action(OrderActions.LoadOrder, { cancelUncompleted: true })
  protected loadOrder(
    ctx: ThisStateContext,
    { orderId }: OrderActions.LoadOrder
  ) {
    ctx.patchState({ currentOrder: null });
    return this._service.get(orderId).pipe(
      tap((order) => ctx.patchState({ currentOrder: order })),
      tap(
        (order) =>
          order && ctx.dispatch(new RecentsActions.AddRecentOrder(order))
      ),
      map((order) => order?.Id || null),
      optimisticStateUpdate(orderId, ctx, 'currentOrderId'),
      syncLoadProgress(ctx)
    );
  }
}
