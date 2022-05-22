import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { CosAccordionModule } from '@cosmos/components/accordion';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { OrderCustomerMessagesComponentModule } from '../../components/order-customer-messages';
import { OrderDecorationItemComponentModule } from '../../components/order-decoration-item';
import { OrderLineItemComponentModule } from '../../components/order-line-item';
import { OrderQuoteHeaderComponentModule } from '../../components/order-quote-header';
import { OrderQuoteSummaryComponentModule } from '../../components/order-quote-summary';
import { OrderSideMenuComponentModule } from '../../components/order-side-menu';
import { OrderStatusComponentModule } from '../../components/order-status';
import { OrderDetailLocalState } from '../../local-states';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-order-decoration',
  templateUrl: './order-decoration.page.html',
  styleUrls: ['./order-decoration.page.scss'],
})
export class OrderDecorationPage {
  constructor(public readonly state: OrderDetailLocalState) {
    state.connect(this);
  }
}

@NgModule({
  declarations: [OrderDecorationPage],
  imports: [
    CommonModule,
    OrderStatusComponentModule,
    OrderQuoteSummaryComponentModule,
    OrderSideMenuComponentModule,
    OrderQuoteHeaderComponentModule,
    OrderCustomerMessagesComponentModule,
    OrderLineItemComponentModule,
    RouterModule,
    CosCardModule,
    MatMenuModule,
    CosButtonModule,
    CosAccordionModule,
    CosAttributeTagModule,
    OrderDecorationItemComponentModule,
  ],
})
export class OrderDecorationPageModule {}
