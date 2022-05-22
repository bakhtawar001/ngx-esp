import {
  createLoadingSelectorsFor,
  createPropertySelectors,
  createSelectorX,
} from '@cosmos/state';
import { PresentationProduct } from '@esp/models';

import {
  PresentationProductState,
  PresentationProductStateModel,
  PresentationProductOriginalPriceGridsState,
  PresentationProductOriginalPriceGridsStateModel,
} from '../states';

export namespace PresentationProductQueries {
  export const { isLoading, hasLoaded, getLoadError } =
    createLoadingSelectorsFor<PresentationProductStateModel>(
      PresentationProductState
    );

  export const { product: getProduct } =
    createPropertySelectors<PresentationProductStateModel>(
      PresentationProductState
    );

  export const getVisiblePriceGrids = createSelectorX(
    [getProduct],
    (product: PresentationProduct | null) =>
      product?.PriceGrids.filter((priceGrid) => priceGrid.IsVisible) || []
  );

  export const getInvisiblePriceGrids = createSelectorX(
    [getProduct],
    (product: PresentationProduct | null) =>
      product?.PriceGrids.filter(
        (priceGrid) => priceGrid.IsVisible === false
      ) || []
  );
}

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
