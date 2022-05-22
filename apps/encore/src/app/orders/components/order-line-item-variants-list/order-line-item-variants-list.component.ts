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
import { ProductLineItemDomainModel } from '@esp/models';
import { OrderPercentPipeModule, OrderPricePipeModule } from '../../pipes';
import { IsServiceChargeRowPipeModule } from './is-service-charge-row.pipe';
import { IsTotalUnitsRowPipeModule } from './is-total-units-row.pipe';
import { IsVariantRowPipeModule } from './is-variant-row.pipe';
import { VariantsGridDataSourcePipeModule } from './variants-grid-data-source.pipe';

@Component({
  selector: 'esp-order-line-item-variants-list',
  templateUrl: './order-line-item-variants-list.component.html',
  styleUrls: ['./order-line-item-variants-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OrderLineItemVariantsListComponent {
  @Input() lineItem: ProductLineItemDomainModel;

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
}

@NgModule({
  declarations: [OrderLineItemVariantsListComponent],
  imports: [
    CommonModule,
    CosTableModule,
    CosCheckboxModule,
    CosAttributeTagModule,
    OrderPricePipeModule,
    OrderPercentPipeModule,
    IsServiceChargeRowPipeModule,
    IsTotalUnitsRowPipeModule,
    IsVariantRowPipeModule,
    VariantsGridDataSourcePipeModule,
  ],
  exports: [OrderLineItemVariantsListComponent],
})
export class OrderLineItemVariantsListComponentModule {}
