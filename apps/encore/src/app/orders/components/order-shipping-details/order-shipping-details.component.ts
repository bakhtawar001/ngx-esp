import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { OrderDomainModel } from '@esp/models';
import { OrderCustomerAddressComponentModule } from '../order-customer-address';
import { OrderDecorationItemProductComponentModule } from '../order-decoration-item-product';

@Component({
  selector: 'esp-order-shipping-details',
  templateUrl: './order-shipping-details.component.html',
  styleUrls: ['./order-shipping-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderShippingDetailsComponent {
  @Input() order: OrderDomainModel;
}

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    CosCardModule,
    CosButtonModule,
    CosAttributeTagModule,
    OrderCustomerAddressComponentModule,
    OrderDecorationItemProductComponentModule,
  ],
  declarations: [OrderShippingDetailsComponent],
  exports: [OrderShippingDetailsComponent],
})
export class OrderShippingDetailsModule {}
