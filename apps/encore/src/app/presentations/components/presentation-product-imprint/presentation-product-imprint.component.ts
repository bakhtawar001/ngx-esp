import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { CosTableModule } from '@cosmos/components/table';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import { PresentationProductChargesTableComponentModule } from '../presentation-product-charges-table/presentation-product-charges-table.component';

@Component({
  selector: 'esp-presentation-product-imprint',
  templateUrl: './presentation-product-imprint.component.html',
  styleUrls: ['./presentation-product-imprint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationProductImprintComponent {
  checked = false;
  displayedColumns = ['quantity', 'catalogPrice', 'netCost', 'eqp', 'profit'];
  displayedColumns2 = ['imprintCharges', 'chargeQty', 'price', 'action'];
  showImprint = true;

  dataSource = [];
  dataSource2 = [
    {
      charge:
        'Shipping Charge - Split Shipments incur a handling charge per box',
      quantity: 'per product',
      price: '$15.00',
      action: '',
    },
    {
      charge: 'Shipping Charge - Package redirect',
      quantity: 'per product',
      price: '$15.00',
      action: '',
    },
    {
      charge: 'Shipping Charge - Address correction',
      quantity: 'per product',
      price: '$15.00',
      action: '',
    },
  ];

  toggleImprint() {
    this.showImprint = !this.showImprint;
  }
}

@NgModule({
  declarations: [PresentationProductImprintComponent],
  imports: [
    CommonModule,

    // FormsModule,
    // ReactiveFormsModule,
    // RouterModule,

    // MatMenuModule,

    CosButtonModule,
    CosCardModule,
    CosCheckboxModule,
    CosFormFieldModule,
    CosInputModule,
    CosSlideToggleModule,
    CosTableModule,

    PresentationProductChargesTableComponentModule,
  ],
  exports: [PresentationProductImprintComponent],
})
export class PresentationProductImprintComponentModule {}
