import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
} from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { CosPaginationModule } from '@cosmos/components/pagination';
import { CosProductCardModule } from '@cosmos/components/product-card';
import { ShareProductsDialogData } from './models';
import { CosButtonGroupModule } from '@cosmos/components/button-group';


@Component({
  selector: 'esp-share-products-dialog',
  templateUrl: './share-products.dialog.html',
  styleUrls: ['./share-products.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareProductsDialog {
  products: any[];
  pageIndex = 0;
  shareTypes = [
    { name: 'Share via email', value: 'email' },
    { name: 'Share via link', value: 'link' },
  ];
  shareTypesButtonGroupName = 'shareType';
  shareTypesAriaLabel = 'Choose a Type of Email';
  shareTypesSelectedValue = 'email';

  get currentProduct() {
    return this.products[this.pageIndex];
  }

  constructor(@Inject(MAT_DIALOG_DATA) private data: ShareProductsDialogData) {
    this.products = data.products;
  }

  get productText() {
    return this.products.length > 1 ? 'Products' : 'Product';
  }

  public pageChange($event) {
    this.pageIndex = $event.pageIndex;
  }
}

@NgModule({
  declarations: [ShareProductsDialog],
  imports: [
    CommonModule,
    MatDialogModule,
    CosButtonGroupModule,
    CosFormFieldModule,
    CosInputModule,
    CosPaginationModule,
    CosProductCardModule,
  ],
})
export class ShareProductsDialogModule {}
