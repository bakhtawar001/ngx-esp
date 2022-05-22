import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { OrderDomainModel } from '@esp/models';
import { OrderPercentPipeModule, OrderPricePipeModule } from '../../pipes';

@Component({
  selector: 'esp-order-quote-summary',
  templateUrl: './order-quote-summary.component.html',
  styleUrls: ['./order-quote-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderQuoteSummaryComponent {
  @Input() order: OrderDomainModel;
}

@NgModule({
  imports: [CommonModule, OrderPricePipeModule, OrderPercentPipeModule],
  declarations: [OrderQuoteSummaryComponent],
  exports: [OrderQuoteSummaryComponent],
})
export class OrderQuoteSummaryComponentModule {}
