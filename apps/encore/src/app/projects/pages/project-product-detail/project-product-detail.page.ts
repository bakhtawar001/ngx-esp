import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosAutocompleteModule } from '@cosmos/components/autocomplete';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import {
  CosImageUploadFormModule,
  CosImageUploadPreviewsListModule,
} from '@cosmos/components/image-upload-form';
import { CosInputModule } from '@cosmos/components/input';
import { CosTableModule } from '@cosmos/components/table';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import { ProductImageComponentModule } from '@smartlink/products';
import { DetailHeaderComponentModule } from '../../../core/components/detail-header';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-project-product-detail',
  templateUrl: './project-product-detail.page.html',
  styleUrls: ['./project-product-detail.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectProductDetailPage {
  image = '/media/22624610';
  imageIsSelected = new FormControl(false);
  checked = false;
  displayedColumns = ['quantity', 'catalogPrice', 'netCost', 'eqp', 'profit'];

  dataSource = [];

  displayedColumns2 = ['imprintCharges', 'chargeQty', 'price', 'action'];

  dataSource2 = [
    {
      imprintCharges:
        'Shipping Charge - Split Shipments incur a handling charge per box',
      chargeQty: 'per product',
      price: '$15.00',
      action: '',
    },
    {
      imprintCharges: 'Shipping Charge - Package redirect',
      chargeQty: 'per product',
      price: '$15.00',
      action: '',
    },
    {
      imprintCharges: 'Shipping Charge - Address correction',
      chargeQty: 'per product',
      price: '$15.00',
      action: '',
    },
  ];

  displayedColumns3 = ['size', 'color', 'minprice'];

  dataSource3 = [];

  displayedColumns4 = ['size', 'color', 'minprice', 'action'];

  dataSource4 = [
    {
      size: 'XS, S, M, L',
      color: 'Deep Blue Sea, Sandy Sand',
      minprice: '$15.00',
    },
  ];

  displayedColumns5 = ['chargename', 'chargeqty', 'price'];

  dataSource5 = [];

  displayedColumns6 = ['charges', 'chargeqty', 'price', 'action'];

  dataSource6 = [
    {
      charges:
        'Shipping Charge - Split Shipments incur a handling charge per box',
      chargeqty: 'per product',
      price: '$15.00',
      action: '',
    },
    {
      charges:
        'Shipping Charge - Split Shipments incur a handling charge per box',
      chargeqty: 'per product',
      price: '$15.00',
      action: '',
    },
    {
      charges:
        'Shipping Charge - Split Shipments incur a handling charge per box',
      chargeqty: 'per product',
      price: '$15.00',
      action: '',
    },
    {
      charges:
        'Shipping Charge - Split Shipments incur a handling charge per box',
      chargeqty: 'per product',
      price: '$15.00',
      action: '',
    },
  ];

  data = [{ name: 'Adult Softspun Semi-Fitted Tee', type: 'Product' }];

  uploadedProductImages = [
    ...new Array(45)
      .fill('')
      .map(
        (_, idx) => `https://api.uat-asicentral.com/v1/media/2409741${idx + 5}`
      ),
  ];

  defaultProductImages = [
    'https://api.uat-asicentral.com/v1/media/24097411',
    'https://api.uat-asicentral.com/v1/media/24097412',
    'https://api.uat-asicentral.com/v1/media/24097413',
    'https://api.uat-asicentral.com/v1/media/24097414',
  ];

  selectImage() {
    this.imageIsSelected.setValue(true);
    this.uploadedProductImages.unshift(
      'https://api.asicentral.com/v1/media/22624610?size=normal'
    );
  }

  delete() {
    console.log('am doing a delete');
  }

  filterFn(raw, normalizedProp, searchTerm) {
    return Object.values(raw).join().toLowerCase().includes(searchTerm);
  }
}

@NgModule({
  declarations: [ProjectProductDetailPage],
  imports: [
    CommonModule,
    CosFormFieldModule,
    CosInputModule,
    CosSlideToggleModule,
    CosCardModule,
    CosButtonModule,
    CosCheckboxModule,
    CosTableModule,
    CosAttributeTagModule,
    CosAutocompleteModule,
    CosImageUploadFormModule,
    CosImageUploadPreviewsListModule,
    DetailHeaderComponentModule,
    ProductImageComponentModule,
    MatMenuModule,

    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ProjectProductDetailPageModule {}
