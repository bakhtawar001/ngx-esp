import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosPillModule } from '@cosmos/components/pill';
import { CosPresentationHeaderModule } from '@cosmos/components/presentation-header';
import { CosProductCardModule } from '@cosmos/components/product-card';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PresentationFooterComponentModule } from '../../../core/components/footer/presentation-footer.component';
import { PresentationDialogService } from '../../services';

@UntilDestroy()
@Component({
  selector: 'esp-presentation-invoice',
  templateUrl: './presentation-invoice.page.html',
  styleUrls: ['./presentation-invoice.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationInvoicePage {
  invoice = {
    Id: 0,
  };

  constructor(private _presentationDialogService: PresentationDialogService) {}

  makePayment() {
    this._presentationDialogService
      .makePaymentDialog({
        invoiceId: this.invoice.Id,
      })
      .pipe(untilDestroyed(this))
      .subscribe((invoice) => {
        if (invoice) {
          console.log(invoice);
        }
      });
  }
}

@NgModule({
  declarations: [PresentationInvoicePage],
  imports: [
    CommonModule,
    CosPresentationHeaderModule,
    CosProductCardModule,
    PresentationFooterComponentModule,
    CosCardModule,
    CosButtonModule,
    MatDialogModule,
    MatNativeDateModule,
    NativeDateModule,
    CosCheckboxModule,
    CosPillModule,
    MatDividerModule,
    RouterModule,
  ],
})
export class PresentationInvoicePageModule {}
