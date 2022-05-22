import { Injectable } from '@angular/core';
import {
  createPropertySelectors,
  optimisticUpdate,
  setOrRemoveProp,
} from '@cosmos/state';
import { LineItem } from '@esp/models';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { switchMap, tap } from 'rxjs/operators';
import {
  OrderActions,
  OrderLineItemActions,
  OrderProductActions,
} from '../actions';
import { isProductLineItem } from '../calculators';
import { OrdersService } from '../services/orders.service';

export interface OrderLineStateModel {
  currentLineItemId: number;
  lineItemsUpdating: Record<number, LineItem>;
}

type ThisStateModel = OrderLineStateModel;
type ThisStateContext = StateContext<ThisStateModel>;

@State<ThisStateModel>({
  name: 'orderLineItems',
  defaults: {
    currentLineItemId: null,
    lineItemsUpdating: {},
  },
})
@Injectable()
export class OrderLineItemsState {
  static readonly props =
    createPropertySelectors<ThisStateModel>(OrderLineItemsState);

  constructor(
    private readonly store: Store,
    private readonly _service: OrdersService
  ) {}

  @Action(OrderLineItemActions.LoadOrderLineItem)
  loadLineItem(
    ctx: ThisStateContext,
    { orderId, lineItemId }: OrderLineItemActions.LoadOrderLineItem
  ) {
    return ctx.dispatch(new OrderActions.LoadOrder(orderId)).pipe(
      tap(() => ctx.setState(patch({ currentLineItemId: lineItemId }))),
      switchMap(() => {
        const order = this.store.selectSnapshot(
          (state) => state.currentOrder.currentOrder
        );
        const lineItem = order?.LineItems?.find(
          (item: LineItem) => item.Id === lineItemId
        );

        if (isProductLineItem(lineItem)) {
          return ctx.dispatch(
            new OrderProductActions.LoadProduct(lineItem.ProductId)
          );
        }
      })
    );
  }

  @Action(OrderLineItemActions.UpdateOrderLineItem)
  updateOrderLineItem(
    ctx: ThisStateContext,
    {
      orderId,
      orderLineItem,
      updateTaxes,
    }: OrderLineItemActions.UpdateOrderLineItem
  ) {
    const id = orderLineItem.Id;
    return this._service
      .updateLineItem(orderId, orderLineItem, updateTaxes)
      .pipe(
        optimisticUpdate(orderLineItem, {
          getValue: () => ctx.getState().lineItemsUpdating[id],
          setValue: (value) =>
            ctx.setState(
              patch<ThisStateModel>({
                lineItemsUpdating: setOrRemoveProp(id, value),
              })
            ),
        }),
        tap((value) => {})
      );
  }
}
