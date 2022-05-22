import { Injectable } from '@angular/core';
import {
  asDispatch,
  fromSelector,
  LocalState,
  stateBehavior,
} from '@cosmos/state';
import { ProductQueries } from '@smartlink/products';
import { SupplierActions, SupplierQueries } from '@smartlink/suppliers';
import { distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { sortBy } from 'lodash-es';

const memoizedMap = new Map<any, any>();

@Injectable()
export class ProductDetailLocalState extends LocalState<ProductDetailLocalState> {
  product = fromSelector(ProductQueries.getProduct);
  media = fromSelector(ProductQueries.getMedia);
  private _inventory = fromSelector(ProductQueries.getInventory);
  private _supplier = fromSelector(SupplierQueries.getSupplier);

  selectSupplier = asDispatch(SupplierActions.SelectSupplier);

  private _loadSupplier = stateBehavior<ProductDetailLocalState>((state$) =>
    state$.pipe(
      map(({ product }) => product?.Supplier?.Id),
      filter(Boolean),
      distinctUntilChanged(),
      tap((supplierId) => this.selectSupplier(supplierId))
    )
  );

  get inventory() {
    if (memoizedMap.has(this._inventory)) {
      return memoizedMap.get(this._inventory);
    }

    if (this._inventory?.ProductQuantities?.length) {
      const result = this._inventory.ProductQuantities?.[0].Quantities.map(
        (q) => ({
          ...q,
          PartCode: q.PartCode || '',
        })
      );

      const sortedResult = sortBy(result, ['PartCode']);

      memoizedMap.set(this._inventory, sortedResult);

      return result;
    }
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
