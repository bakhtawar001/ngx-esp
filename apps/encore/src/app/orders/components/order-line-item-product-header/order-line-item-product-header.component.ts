import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { CosSupplierModule } from '@cosmos/components/supplier';
import { ProductLineItemDomainModel } from '@esp/models';

@Component({
  selector: 'esp-order-line-item-product-header',
  templateUrl: './order-line-item-product-header.component.html',
  styleUrls: ['./order-line-item-product-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderLineItemProductHeaderComponent {
  @Input() lineItem: ProductLineItemDomainModel;

  @Input() locked: boolean;
}

@NgModule({
  declarations: [OrderLineItemProductHeaderComponent],
  imports: [CommonModule, CosSupplierModule],
  exports: [OrderLineItemProductHeaderComponent],
})
export class OrderLineItemProductHeaderComponentModule {}
