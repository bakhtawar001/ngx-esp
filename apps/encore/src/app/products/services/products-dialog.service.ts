import { Injectable } from '@angular/core';
import { DialogService } from '@cosmos/core';
import {
  ProductInventoryDialogData,
  productInventoryDialogDef,
} from '../dialogs/product-inventory';
import {
  ProductPricingDialogData,
  productPricingDialogDef,
} from '../dialogs/product-pricing';
import {
  ShareProductsDialogData,
  shareProductsDialogDef,
} from '../dialogs/share-products';

@Injectable({
  providedIn: 'root',
})
export class ProductsDialogService {
  constructor(private dialog: DialogService) {}

  openInventoryDialog(data: ProductInventoryDialogData) {
    return this.dialog.open(productInventoryDialogDef, data);
  }

  openPriceGridDialog(data: ProductPricingDialogData) {
    return this.dialog.open(productPricingDialogDef, data);
  }

  openShareDialog(data: ShareProductsDialogData) {
    return this.dialog.open(shareProductsDialogDef, data);
  }
}
