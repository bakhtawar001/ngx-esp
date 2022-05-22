import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { CosCardModule } from '@cosmos/components/card';
import { trackItem } from '@cosmos/core';
import { OrderDomainModel, OrderNote } from '@esp/models';

@Component({
  selector: 'esp-order-customer-messages',
  templateUrl: './order-customer-messages.component.html',
  styleUrls: ['./order-customer-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCustomerMessagesComponent {
  @Input() order: OrderDomainModel;

  note: any;

  trackNote = trackItem<OrderNote>(['Id']);
}

@NgModule({
  imports: [CommonModule, CosCardModule],
  declarations: [OrderCustomerMessagesComponent],
  exports: [OrderCustomerMessagesComponent],
})
export class OrderCustomerMessagesComponentModule {}
