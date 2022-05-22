import { createLoadingSelectorsFor, createSelectorX } from '@cosmos/state';
import { CurrentOrderQueries } from '.';
import {
  CurrentOrderState,
  OrderLineItemsState,
  OrderStateModel,
} from '../states';

export namespace LineItemsQueries {
  export const { isLoading, hasLoaded, getLoadError } =
    createLoadingSelectorsFor<OrderStateModel>(CurrentOrderState);

  export const getCurrentLineItem = createSelectorX(
    [
      CurrentOrderQueries.getCurrentOrderDomainModel,
      OrderLineItemsState.props.currentLineItemId,
    ],
    (order, lineItemId) => {
      if (!order || !lineItemId) {
        return null;
      }

      const lineItem = order.LineItems?.find((item) => item.Id === lineItemId);
      return lineItem;
    }
  );
}
