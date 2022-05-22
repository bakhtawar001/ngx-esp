import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CosSegmentedPanelComponent } from './segmented-panel.component';
import { CosSegmentedPanelRowComponent } from './segmented-panel-row.component';
import { CosSegmentedPanelHeaderComponent } from './segmented-panel-header.component';

@NgModule({
  imports: [CommonModule],
  exports: [
    CosSegmentedPanelComponent,
    CosSegmentedPanelRowComponent,
    CosSegmentedPanelHeaderComponent,
  ],
  declarations: [
    CosSegmentedPanelComponent,
    CosSegmentedPanelRowComponent,
    CosSegmentedPanelHeaderComponent,
  ],
})
export class CosSegmentedPanelModule {}
