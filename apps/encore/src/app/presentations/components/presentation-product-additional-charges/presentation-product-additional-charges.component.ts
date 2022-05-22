import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosTableModule } from '@cosmos/components/table';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import { PresentationProductChargesTableComponentModule } from '../presentation-product-charges-table/presentation-product-charges-table.component';

@Component({
  selector: 'esp-presentation-product-additional-charges',
  templateUrl: './presentation-product-additional-charges.component.html',
  styleUrls: ['./presentation-product-additional-charges.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationProductAdditionalChargesComponent {
  charges = [];
  chargesColumns = ['chargename', 'chargeqty', 'price'];
  showAdditionalCharges = true;

  dataSource = [
    {
      charge:
        'Shipping Charge - Split Shipments incur a handling charge per box',
      quantity: 'per product',
      price: '$15.00',
      action: '',
    },
    {
      charge:
        'Shipping Charge - Split Shipments incur a handling charge per box',
      quantity: 'per product',
      price: '$15.00',
      action: '',
    },
    {
      charge:
        'Shipping Charge - Split Shipments incur a handling charge per box',
      quantity: 'per product',
      price: '$15.00',
      action: '',
    },
    {
      charge:
        'Shipping Charge - Split Shipments incur a handling charge per box',
      quantity: 'per product',
      price: '$15.00',
      action: '',
    },
  ];

  toggleAdditionalCharges() {
    this.showAdditionalCharges = !this.showAdditionalCharges;
  }
}

@NgModule({
  declarations: [PresentationProductAdditionalChargesComponent],
  imports: [
    CommonModule,
    CosButtonModule,
    CosCardModule,
    CosSlideToggleModule,
    CosTableModule,
    PresentationProductChargesTableComponentModule,
  ],
  exports: [PresentationProductAdditionalChargesComponent],
})
export class PresentationProductAdditionalChargesComponentModule {}
