import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import {
  CosTrackerAccordionComponent,
  CosTrackerAccordionLabelComponent,
} from './tracker-accordion.component';

@NgModule({
  imports: [CommonModule, CosButtonModule],
  exports: [CosTrackerAccordionComponent, CosTrackerAccordionLabelComponent],
  declarations: [
    CosTrackerAccordionComponent,
    CosTrackerAccordionLabelComponent,
  ],
})
export class CosTrackerAccordionModule {}
