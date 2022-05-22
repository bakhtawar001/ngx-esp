import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { CosAccordionModule } from '@cosmos/components/accordion';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { OrderShippingDetailsModule } from '../../components/order-shipping-details';
import { OrderDetailLocalState } from '../../local-states';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-order-shipping',
  templateUrl: './order-shipping.page.html',
  styleUrls: ['./order-shipping.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderShippingPage {
  constructor(public readonly state: OrderDetailLocalState) {
    state.connect(this);
  }
}

@NgModule({
  declarations: [OrderShippingPage],
  imports: [
    CommonModule,
    CosCardModule,
    RouterModule,
    MatMenuModule,
    CosButtonModule,
    CosAccordionModule,
    CosAttributeTagModule,
    OrderShippingDetailsModule,
  ],
})
export class OrderShippingPageModule {}
