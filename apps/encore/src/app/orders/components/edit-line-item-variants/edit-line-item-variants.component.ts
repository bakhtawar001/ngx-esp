import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { CosRadioModule } from '@cosmos/components/radio';
import { CosTableModule } from '@cosmos/components/table';
import { ProductLineItemDomainModel } from '@esp/models';

@Component({
  selector: 'esp-edit-line-item-variants',
  templateUrl: './edit-line-item-variants.component.html',
  styleUrls: ['./edit-line-item-variants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditLineItemVariantsComponent {
  @Input() lineItem: ProductLineItemDomainModel;

  columnsBulkHeader = [
    'itemBulk',
    'skuBulk',
    'quantityBulk',
    'netCostBulk',
    'originalBulk',
    'marginBulk',
    'priceBulk',
    'totalBulk',
    'taxBulk',
  ];

  columns = [
    'item',
    'sku',
    'quantity',
    'netCost',
    'original',
    'margin',
    'price',
    'totalPrice',
    'totalCost',
    'tax',
  ];

  get currencySymbol() {
    return this.lineItem?.CurrencySymbol;
  }

  get currencyCode() {
    return this.lineItem?.CurrencyCode;
  }
}

@NgModule({
  imports: [
    CommonModule,
    CosTableModule,
    CosFormFieldModule,
    CosInputModule,
    CosButtonModule,
    CosRadioModule,
    CosCheckboxModule,
  ],
  declarations: [EditLineItemVariantsComponent],
  exports: [EditLineItemVariantsComponent],
})
export class EditLineItemVariantsComponentModule {}
