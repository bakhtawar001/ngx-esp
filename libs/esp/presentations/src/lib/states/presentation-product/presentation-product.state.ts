import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ToastActions, ToastData } from '@cosmos/components/notification';
import { ModelWithLoadingStatus, syncLoadProgress } from '@cosmos/state';
import { PresentationProduct } from '@esp/models';
import { Price, PriceGrid } from '@smartlink/models';

import {
  PresentationsActions,
  PresentationProductActions,
} from '../../actions';
import { PresentationProductsApiService } from '../../api';
import { PresentationProductOriginalPriceGridsState } from './original-price-grids.state';

const TOAST_MESSAGES = {
  PRODUCT_SAVE: (product: PresentationProduct): ToastData => ({
    title: `Product ${product.Name} ${product?.Id ? 'updated' : 'saved'}!`,
    body: `${product.Name} has been ${product?.Id ? 'updated' : 'saved'}.`,
    type: 'confirm',
  }),
  PRODUCT_NOT_SAVED: (): ToastData => ({
    title: 'Error!',
    body: `Product failed to save.`,
    type: 'error',
  }),
  PRODUCTS_NOT_VISIBLE: (isVisible: boolean): ToastData => ({
    title: 'Error!',
    body: `Product failed to ${isVisible ? 'show' : 'hide'}.`,
    type: 'error',
  }),
};

export interface PresentationProductStateModel extends ModelWithLoadingStatus {
  product: PresentationProduct | null;
}

type LocalStateContext = StateContext<PresentationProductStateModel>;

@State<PresentationProductStateModel>({
  name: 'presentationProduct',
  defaults: {
    product: null,
  },
  children: [PresentationProductOriginalPriceGridsState],
})
@Injectable()
export class PresentationProductState {
  constructor(private readonly service: PresentationProductsApiService) {}

  @Action(PresentationProductActions.Get)
  get(ctx: LocalStateContext, action: PresentationProductActions.Get) {
    return this.service.get(action.productId).pipe(
      tap((product) => ctx.patchState({ product })),
      syncLoadProgress(ctx)
    );
  }

  @Action(PresentationProductActions.Save)
  save(ctx: LocalStateContext, { product }: PresentationProductActions.Save) {
    return this.service.update(product).pipe(
      tap((product) => {
        ctx.patchState({ product });
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.PRODUCT_SAVE(product))
        );
      }),
      catchError(() => {
        ctx.dispatch(new ToastActions.Show(TOAST_MESSAGES.PRODUCT_NOT_SAVED()));
        return EMPTY;
      })
    );
  }

  @Action(PresentationProductActions.SaveVisibility)
  saveVisibility(
    ctx: LocalStateContext,
    { productId, isVisible }: PresentationProductActions.SaveVisibility
  ) {
    return this.service.saveVisibility(productId, isVisible).pipe(
      tap(() =>
        ctx.dispatch([
          new PresentationsActions.UpdatePresentationProductVisibility(
            productId,
            isVisible
          ),
        ])
      ),
      catchError(() => {
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.PRODUCTS_NOT_VISIBLE(isVisible))
        );
        return EMPTY;
      })
    );
  }

  @Action(PresentationProductActions.PatchPriceGrid)
  patchPriceGrid(
    ctx: LocalStateContext,
    action: PresentationProductActions.PatchPriceGrid
  ): void {
    ctx.setState(
      patch<PresentationProductStateModel>({
        product: patch<PresentationProduct>({
          PriceGrids: updateItem<PriceGrid>(
            (priceGrid) => priceGrid === action.priceGrid,
            patch(action.patchSpec)
          ),
        }),
      })
    );
  }

  @Action(PresentationProductActions.TogglePriceVisibility)
  togglePriceVisibility(
    ctx: LocalStateContext,
    action: PresentationProductActions.TogglePriceVisibility
  ): void {
    ctx.setState(
      patch<PresentationProductStateModel>({
        product: patch<PresentationProduct>({
          PriceGrids: updateItem<PriceGrid>(
            (priceGrid) => priceGrid === action.priceGrid,
            patch({
              Prices: updateItem<Price>(
                (price) => price === action.price,
                patch({ IsVisible: action.isVisible })
              ),
            })
          ),
        }),
      })
    );
  }

  @Action(PresentationProductActions.RemovePrice)
  removePrice(
    ctx: LocalStateContext,
    action: PresentationProductActions.RemovePrice
  ): void {
    ctx.setState(
      patch<PresentationProductStateModel>({
        product: patch<PresentationProduct>({
          PriceGrids: updateItem<PriceGrid>(
            (priceGrid) => priceGrid === action.priceGrid,
            patch<PriceGrid>({
              Prices: removeItem((price) => price === action.price),
            })
          ),
        }),
      })
    );
  }

  @Action(PresentationProductActions.AddAllPriceGrids)
  addAllPriceGrids(ctx: LocalStateContext): void {
    ctx.setState(
      patch<PresentationProductStateModel>({
        product: patch<PresentationProduct>({
          PriceGrids: updateItem<PriceGrid>(
            (priceGrid) => priceGrid!.IsVisible === false,
            patch({
              IsVisible: true,
            })
          ),
        }),
      })
    );
  }

  @Action(PresentationProductActions.UpdateMarginWhenNetCostOrPriceChanges)
  updateMarginWhenNetCostOrPriceChanges(
    ctx: LocalStateContext,
    action: PresentationProductActions.UpdateMarginWhenNetCostOrPriceChanges
  ): void {
    ctx.setState(
      patch<PresentationProductStateModel>({
        product: patch<PresentationProduct>({
          PriceGrids: updateItem<PriceGrid>(
            (priceGrid) => priceGrid === action.priceGrid,
            patch({
              Prices: updateItem<Price>(
                (price) => price === action.price,
                patch<Price>({
                  Cost: action.newNetCost,
                  Price: action.newPrice,
                  DiscountPercent: calculateMargin(
                    action.newPrice,
                    action.newNetCost
                  ),
                })
              ),
            })
          ),
        }),
      })
    );
  }

  @Action(PresentationProductActions.AddCustomQuantity)
  addCustomQuantity(
    ctx: LocalStateContext,
    action: PresentationProductActions.AddCustomQuantity
  ): void {
    ctx.setState(
      patch<PresentationProductStateModel>({
        product: patch<PresentationProduct>({
          PriceGrids: updateItem<PriceGrid>(
            (priceGrid) => priceGrid === action.priceGrid,
            patch({
              Prices: append([
                <Partial<Price>>{
                  Quantity: {
                    From: 0,
                    To: 0,
                  },
                  IsCustomPrice: true,
                },
              ]),
            })
          ),
        }),
      })
    );
  }

  @Action(PresentationProductActions.RestoreToDefault)
  restoreToDefault(
    ctx: LocalStateContext,
    action: PresentationProductActions.RestoreToDefault
  ): void {
    ctx.setState(
      patch<PresentationProductStateModel>({
        product: patch<PresentationProduct>({
          PriceGrids: updateItem<PriceGrid>(
            (priceGrid) => priceGrid === action.priceGrid,
            patch<PriceGrid>({
              Prices: [...action.originalPriceGrid.Prices],
            })
          ),
        }),
      })
    );
  }
}

function calculateMargin(newPrice: number, newNetCost: number): number {
  // Given `newPrice` is 4.35
  // Given `newNetCost` is 2.61
  // (4.35 - 2.61) / 4.35 = 0.39999999999999997 in JavaScript
  const margin = (newPrice - newNetCost) / newPrice;
  // `(0.39999999999999997).toFixed(1)` will return a string `0.4`
  return parseFloat(margin.toFixed(1));
}
