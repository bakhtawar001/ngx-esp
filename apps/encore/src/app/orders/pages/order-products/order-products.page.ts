import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosSupplierModule } from '@cosmos/components/supplier';
import { trackByFn } from '@cosmos/core';
import { CardMetadataListModule } from '../../../core/components/cards';
import { OrderCustomerMessagesComponentModule } from '../../components/order-customer-messages';
import { OrderLineItemComponentModule } from '../../components/order-line-item';
import { OrderQuoteHeaderComponentModule } from '../../components/order-quote-header';
import { OrderDetailLocalState } from '../../local-states';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-order-products',
  templateUrl: './order-products.page.html',
  styleUrls: ['./order-products.page.scss'],
})
export class OrderProductsPage {
  constructor(public readonly state: OrderDetailLocalState) {
    state.connect(this);
  }

  trackBy = trackByFn(['Id']);
}

@NgModule({
  declarations: [OrderProductsPage],
  imports: [
    CommonModule,
    CosCardModule,
    CardMetadataListModule,
    OrderQuoteHeaderComponentModule,
    MatMenuModule,
    CosButtonModule,
    CosSupplierModule,
    CosAttributeTagModule,
    OrderCustomerMessagesComponentModule,
    OrderLineItemComponentModule,
  ],
})
export class OrderProductsPageModule {}
