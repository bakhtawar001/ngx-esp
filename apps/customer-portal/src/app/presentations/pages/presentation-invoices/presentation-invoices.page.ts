import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosCollectionSectionModule } from '@cosmos/components/collection-section';
import { CosPillModule } from '@cosmos/components/pill';
import { CosPresentationHeaderModule } from '@cosmos/components/presentation-header';
import { CosProductCardModule } from '@cosmos/components/product-card';
import { PresentationFooterComponentModule } from '../../../core/components/footer/presentation-footer.component';

@Component({
  selector: 'esp-presentation-invoices',
  templateUrl: './presentation-invoices.page.html',
  styleUrls: ['./presentation-invoices.page.scss'],
})
export class PresentationInvoicesPage {}

@NgModule({
  declarations: [PresentationInvoicesPage],
  imports: [
    CommonModule,
    CosPresentationHeaderModule,
    CosProductCardModule,
    PresentationFooterComponentModule,
    CosCardModule,
    CosButtonModule,
    MatNativeDateModule,
    NativeDateModule,
    CosCheckboxModule,
    MatDividerModule,
    CosPillModule,
    CosCollectionSectionModule,
    RouterModule,
  ],
})
export class PresentationInvoicesPageModule {}
