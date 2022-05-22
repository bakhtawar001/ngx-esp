import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosNotificationModule } from '@cosmos/components/notification';
import { CosPresentationHeaderModule } from '@cosmos/components/presentation-header';
import { CosProductCardModule } from '@cosmos/components/product-card';
import { PresentationFooterComponentModule } from '../../../core/components/footer/presentation-footer.component';

@Component({
  selector: 'esp-presentation-quotes-request',
  templateUrl: './presentation-quotes-request.page.html',
  styleUrls: ['./presentation-quotes-request.page.scss'],
})
export class PresentationQuoteRequestPage {}

@NgModule({
  declarations: [PresentationQuoteRequestPage],
  imports: [
    CommonModule,
    RouterModule,

    NativeDateModule,

    MatDividerModule,
    MatNativeDateModule,

    CosButtonModule,
    CosNotificationModule,
    CosCardModule,
    CosPresentationHeaderModule,
    CosProductCardModule,
    CosCheckboxModule,

    PresentationFooterComponentModule,
  ],
})
export class PresentationQuoteRequestPageModule {}
