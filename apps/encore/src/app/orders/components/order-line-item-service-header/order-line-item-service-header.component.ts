import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosTableModule } from '@cosmos/components/table';
import { trackByFn } from '@cosmos/core';
import { ServiceLineItemDomainModel } from '@esp/models';
import { OrderPercentPipeModule, OrderPricePipeModule } from '../../pipes';

@Component({
  selector: 'esp-order-line-item-service-header',
  templateUrl: './order-line-item-service-header.component.html',
  styleUrls: ['./order-line-item-service-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OrderLineItemServiceHeaderComponent {
  @Input() lineItem: ServiceLineItemDomainModel;

  @Input() locked: boolean;

  columns = [
    'item',
    'quantity',
    'netCost',
    'margin',
    'price',
    'totalCost',
    'totalPrice',
    'tax',
  ];

  trackByFn = trackByFn;
}

@NgModule({
  declarations: [OrderLineItemServiceHeaderComponent],
  imports: [
    CommonModule,
    CosTableModule,
    CosCheckboxModule,
    CosAttributeTagModule,
    OrderPricePipeModule,
    OrderPercentPipeModule,
  ],
  exports: [OrderLineItemServiceHeaderComponent],
})
export class OrderLineItemServiceHeaderComponentModule {}
