import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  CosAccordionComponent,
  CosAccordionHeaderComponent,
} from '../lib/accordion/accordion.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CosAccordionComponent, CosAccordionHeaderComponent],
  exports: [CosAccordionComponent, CosAccordionHeaderComponent],
})
export class CosAccordionModule {}
