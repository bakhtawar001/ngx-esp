import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosPillModule } from '@cosmos/components/pill';
import { CardMetadataListModule } from '../../../core/components/cards';
import { OrderPaymentInvoiceComponentModule } from '../../components/order-payment-invoice';
import { OrderQuoteHeaderComponentModule } from '../../components/order-quote-header';
import { OrderDetailLocalState } from '../../local-states';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-order-payments',
  templateUrl: './order-payments.page.html',
  styleUrls: ['./order-payments.page.scss'],
})
export class OrderPaymentsPage {
  constructor(public readonly state: OrderDetailLocalState) {
    state.connect(this);
  }
}

@NgModule({
  declarations: [OrderPaymentsPage],
  imports: [
    CommonModule,
    CosCardModule,
    CosButtonModule,
    CardMetadataListModule,
    MatMenuModule,
    CosPillModule,
    CosAttributeTagModule,
    OrderQuoteHeaderComponentModule,
    OrderPaymentInvoiceComponentModule,
  ],
})
export class OrderPaymentsPageModule {}
