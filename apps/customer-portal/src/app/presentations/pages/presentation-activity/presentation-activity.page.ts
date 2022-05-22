import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosPresentationHeaderModule } from '@cosmos/components/presentation-header';
import { CosProductCardModule } from '@cosmos/components/product-card';
import { PresentationFooterComponentModule } from '../../../core/components/footer/presentation-footer.component';

@Component({
  selector: 'esp-presentation-activity',
  templateUrl: './presentation-activity.page.html',
  styleUrls: ['./presentation-activity.page.scss'],
})
export class PresentationActivityPage {}

@NgModule({
  declarations: [PresentationActivityPage],
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
  ],
})
export class PresentationActivityPageModule {}
