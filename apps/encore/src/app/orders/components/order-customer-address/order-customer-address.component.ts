import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { OrderContact } from '@esp/models';

@Component({
  selector: 'esp-order-customer-address',
  templateUrl: './order-customer-address.component.html',
  styleUrls: ['./order-customer-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCustomerAddressComponent {
  @Input() contact: OrderContact;
}

@NgModule({
  declarations: [OrderCustomerAddressComponent],
  imports: [CommonModule],
  exports: [OrderCustomerAddressComponent],
})
export class OrderCustomerAddressComponentModule {}
