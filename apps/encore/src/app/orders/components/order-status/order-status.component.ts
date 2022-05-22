import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { OrderDomainModel } from '@esp/models';

@Component({
  selector: 'esp-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderStatusComponent {
  @Input() order: OrderDomainModel;
}

@NgModule({
  declarations: [OrderStatusComponent],
  imports: [CommonModule],
  exports: [OrderStatusComponent],
})
export class OrderStatusComponentModule {}
