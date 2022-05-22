import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosPillModule } from '@cosmos/components/pill';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  templateUrl: './marketing.page.html',
  styleUrls: ['./marketing.page.scss'],
})
export class MarketingPage {}

@NgModule({
  declarations: [MarketingPage],
  imports: [
    CommonModule,
    CosSegmentedPanelModule,
    AsiPanelEditableRowModule,
    CosPillModule,
  ],
})
export class MarketingPageModule {}
