import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosPillModule } from '@cosmos/components/pill';
import { CosPresentationHeaderModule } from '@cosmos/components/presentation-header';
import { CosProductCardModule } from '@cosmos/components/product-card';
import { CosTrackerModule } from '@cosmos/components/tracker';
import { PresentationFooterComponentModule } from '../../../core/components/footer/presentation-footer.component';

@Component({
  selector: 'esp-presentation-proofs',
  templateUrl: './presentation-proofs.page.html',
  styleUrls: ['./presentation-proofs.page.scss'],
})
export class PresentationProofsPage {}

@NgModule({
  declarations: [PresentationProofsPage],
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
    CosTrackerModule,
    CosPillModule,
    RouterModule,
    MatTabsModule,
  ],
})
export class PresentationProofsPageModule {}
