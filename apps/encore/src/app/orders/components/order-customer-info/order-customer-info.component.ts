import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { OrderDomainModel } from '@esp/models';
import { OrderCustomerAddressComponentModule } from '../order-customer-address';

@Component({
  selector: 'esp-order-customer-info',
  templateUrl: './order-customer-info.component.html',
  styleUrls: ['./order-customer-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCustomerInfoComponent {
  @Input() order: OrderDomainModel;
}

@NgModule({
  declarations: [OrderCustomerInfoComponent],
  imports: [CommonModule, CosButtonModule, OrderCustomerAddressComponentModule],
  exports: [OrderCustomerInfoComponent],
})
export class OrderCustomerInfoComponentModule {}
