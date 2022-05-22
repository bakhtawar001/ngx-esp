import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { whenChanged } from '@cosmos/core';
import {
  OrderLineItemDomainModel,
  ProductLineItemDomainModel,
  ServiceLineItemDomainModel,
  TitleLineItem,
} from '@esp/models';
import {
  isProductLineItem,
  isServiceLineItem,
  isTitleLineItem,
} from '@esp/orders';
import { OrderLineItemProductHeaderComponentModule } from '../order-line-item-product-header';
import { OrderLineItemServiceHeaderComponentModule } from '../order-line-item-service-header';
import { OrderLineItemVariantsListComponentModule } from '../order-line-item-variants-list';

@Component({
  selector: 'esp-order-line-item',
  templateUrl: './order-line-item.component.html',
  styleUrls: ['./order-line-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderLineItemComponent implements OnChanges {
  @Input() lineItem: OrderLineItemDomainModel;

  @Input() locked: boolean;

  titleLineItem: TitleLineItem;
  productLineItem: ProductLineItemDomainModel;
  serviceLineItem: ServiceLineItemDomainModel;

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(this, 'lineItem', changes, () => {
      this.titleLineItem = isTitleLineItem(this.lineItem) && this.lineItem;
      this.productLineItem = isProductLineItem(this.lineItem) && this.lineItem;
      this.serviceLineItem = isServiceLineItem(this.lineItem) && this.lineItem;
    });
  }
}

@NgModule({
  declarations: [OrderLineItemComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    CosCardModule,
    CosButtonModule,
    OrderLineItemProductHeaderComponentModule,
    OrderLineItemServiceHeaderComponentModule,
    OrderLineItemVariantsListComponentModule,
  ],
  exports: [OrderLineItemComponent],
})
export class OrderLineItemComponentModule {}
