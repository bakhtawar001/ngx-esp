import { Injectable } from '@angular/core';
import { distinctUntilChanged, filter, map, tap } from 'rxjs/operators';

import {
  asDispatch,
  fromSelector,
  LocalState,
  stateBehavior,
} from '@cosmos/state';
import {
  PresentationProductActions,
  PresentationProductOriginalPriceGridsActions,
  PresentationProductQueries,
  PresentationsActions,
  PresentationsQueries,
} from '@esp/presentations';
import { SupplierActions, SupplierQueries } from '@smartlink/suppliers';

@Injectable()
export class PresentationProductLocalState extends LocalState<PresentationProductLocalState> {
  private _delete = asDispatch(PresentationProductActions.Delete);
  private _supplier = fromSelector(SupplierQueries.getSupplier);

  hasLoaded = fromSelector(PresentationProductQueries.hasLoaded);
  isLoading = fromSelector(PresentationProductQueries.isLoading);

  product = fromSelector(PresentationProductQueries.getProduct);

  presentation = fromSelector(PresentationsQueries.getPresentation);

  getPresentation = asDispatch(PresentationsActions.Get);

  visiblePriceGrids = fromSelector(
    PresentationProductQueries.getVisiblePriceGrids
  );
  invisiblePriceGrids = fromSelector(
    PresentationProductQueries.getInvisiblePriceGrids
  );

  save = asDispatch(PresentationProductActions.Save);

  selectSupplier = asDispatch(SupplierActions.SelectSupplier);

  togglePriceVisibility = asDispatch(
    PresentationProductActions.TogglePriceVisibility
  );

  removePrice = asDispatch(PresentationProductActions.RemovePrice);

  patchPriceGrid = asDispatch(PresentationProductActions.PatchPriceGrid);

  addAllPriceGrids = asDispatch(PresentationProductActions.AddAllPriceGrids);

  addCustomQuantity = asDispatch(PresentationProductActions.AddCustomQuantity);

  restoreToDefault = asDispatch(PresentationProductActions.RestoreToDefault);

  updateMarginWhenNetCostOrPriceChanges = asDispatch(
    PresentationProductActions.UpdateMarginWhenNetCostOrPriceChanges
  );

  getOriginalPriceGrid = asDispatch(
    PresentationProductOriginalPriceGridsActions.Get
  );

  private _loadSupplier = stateBehavior<PresentationProductLocalState>(
    (state$) =>
      state$.pipe(
        map(({ product }) => product?.Supplier?.AsiSupplierId),
        filter(Boolean),
        distinctUntilChanged(),
        tap((supplierId) => this.selectSupplier(supplierId))
      )
  );

  delete() {
    this._delete(this.product);
  }

  get supplier() {
    // TODO: fix type for cos-supplier-card
    return <any>{
      ...this._supplier,
      Rating: {
        Rating: this._supplier?.Ratings?.OverAll?.Rating,
        Transactions: this._supplier?.Ratings?.OverAll?.Companies,
      },
    };
  }
}
