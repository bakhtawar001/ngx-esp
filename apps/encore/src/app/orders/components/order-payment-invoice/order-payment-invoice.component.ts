import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosCardModule } from '@cosmos/components/card';
import { CosPillModule } from '@cosmos/components/pill';
import { CardMetadataListModule } from '../../../core/components/cards';

@Component({
  selector: 'esp-order-payment-invoice',
  templateUrl: './order-payment-invoice.component.html',
  styleUrls: ['./order-payment-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPaymentInvoiceComponent {}

@NgModule({
  declarations: [OrderPaymentInvoiceComponent],
  imports: [
    CosCardModule,
    MatMenuModule,
    CosPillModule,
    CardMetadataListModule,
  ],
  exports: [OrderPaymentInvoiceComponent],
})
export class OrderPaymentInvoiceComponentModule {}
