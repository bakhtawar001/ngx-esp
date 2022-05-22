import { createSelectorX } from '@cosmos/state';
import { LineItemsQueries } from '@esp/orders';

export namespace EditLineItemViewModelQueries {
  export const { isLoading, getLoadError } = LineItemsQueries;

  export const getLineItemViewModel = createSelectorX(
    [LineItemsQueries.getCurrentLineItem],
    (lineItem) => {
      // TODO: extend line item with additional
      // properties needed for edit line item page
      return lineItem;
    }
  );
}
