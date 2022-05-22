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
import { CosTrackerModule } from '@cosmos/components/tracker';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PresentationFooterComponentModule } from '../../../core/components/footer/presentation-footer.component';
import { PresentationDialogService } from '../../services';

@UntilDestroy()
@Component({
  selector: 'esp-presentation-orders',
  templateUrl: './presentation-orders.page.html',
  styleUrls: ['./presentation-orders.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationOrdersPage {
  constructor(private _presentationDialogService: PresentationDialogService) {}

  trackShipment() {
    this._presentationDialogService
      .trackShipmentDialog({})
      .pipe(untilDestroyed(this))
      .subscribe((invoice) => {
        if (invoice) {
          console.log(invoice);
        }
      });
  }
}

@NgModule({
  declarations: [PresentationOrdersPage],
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
    MatDividerModule,
    CosTrackerModule,
    CosPillModule,
    RouterModule,
  ],
})
export class PresentationOrdersPageModule {}
