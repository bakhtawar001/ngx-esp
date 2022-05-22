import { createPropertySelectors, createSelectorX } from '@cosmos/state';

import {
  PresentationProductOriginalPriceGridsState,
  PresentationProductOriginalPriceGridsStateModel,
} from '../../states';

export namespace PresentationProductOriginalPriceGridsQueries {
  export const { items: getOriginalPriceGrids } =
    createPropertySelectors<PresentationProductOriginalPriceGridsStateModel>(
      PresentationProductOriginalPriceGridsState
    );

  export const getOriginalPriceGrid = (priceGridId: number) =>
    createSelectorX(
      [getOriginalPriceGrids],
      (originalPriceGrids) => originalPriceGrids[priceGridId] || null
    );
}
