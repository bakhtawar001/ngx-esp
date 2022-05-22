import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosPresentationHeaderModule } from '@cosmos/components/presentation-header';
import { CosProductCardModule } from '@cosmos/components/product-card';
import { PresentationFooterComponentModule } from '../../../core/components/footer/presentation-footer.component';

@Component({
  selector: 'esp-presentation-quotes',
  templateUrl: './presentation-quotes.page.html',
  styleUrls: ['./presentation-quotes.page.scss'],
})
export class PresentationQuotesPage {}

@NgModule({
  declarations: [PresentationQuotesPage],
  imports: [
    CommonModule,
    RouterModule,

    NativeDateModule,

    MatDividerModule,
    MatNativeDateModule,

    CosButtonModule,
    CosCardModule,
    CosPresentationHeaderModule,
    CosProductCardModule,
    CosCheckboxModule,

    PresentationFooterComponentModule,
  ],
})
export class PresentationQuotesPageModule {}
