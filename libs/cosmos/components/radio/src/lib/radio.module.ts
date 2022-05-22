import { NgModule } from '@angular/core';

import {
  CosRadioButtonComponent,
  CosRadioGroupDirective,
} from './radio.component';

@NgModule({
  exports: [CosRadioButtonComponent, CosRadioGroupDirective],
  declarations: [CosRadioButtonComponent, CosRadioGroupDirective],
})
export class CosRadioModule {}
