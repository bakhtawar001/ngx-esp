import { getUpdatedList } from '@cosmos/core';
import { createLoadingSelectorsFor, createSelectorX } from '@cosmos/state';
import {
  CurrentOrderState,
  OrderLineItemsState,
  OrderStateModel,
} from '../states';
import { mapOrder } from './_mappers';

export namespace CurrentOrderQueries {
  export const { isLoading, hasLoaded, getLoadError } =
    createLoadingSelectorsFor<OrderStateModel>(CurrentOrderState);

  export const getCurrentOrder = createSelectorX(
    [
      CurrentOrderState.props.currentOrder,
      CurrentOrderState.props.currentOrderId,
      OrderLineItemsState.props.lineItemsUpdating,
    ],
    (currentOrder, currentOrderId, lineItemsUpdating) => {
      if (!currentOrder || currentOrderId !== currentOrder.Id) {
        return null;
      }
      const updatedItems =
        currentOrder &&
        getUpdatedList(currentOrder.LineItems, lineItemsUpdating);
      return updatedItems
        ? { ...currentOrder, LineItems: updatedItems }
        : currentOrder;
    }
  );

  export const getCurrentOrderDomainModel = createSelectorX(
    [getCurrentOrder],
    (currentOrder) => {
      const ignoreMargin = false; // TODO: from system settings
      const domainModel = mapOrder(currentOrder, ignoreMargin);
      return domainModel;
    }
  );
}
