import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CosCardTreeChildComponent,
  CosCardTreeComponent,
  CosCardTreeParentComponent,
} from './card-tree/card-tree.component';

@NgModule({
  imports: [CommonModule],
  exports: [
    CosCardTreeComponent,
    CosCardTreeChildComponent,
    CosCardTreeParentComponent,
  ],
  declarations: [
    CosCardTreeComponent,
    CosCardTreeChildComponent,
    CosCardTreeParentComponent,
  ],
})
export class CosCardTreeModule {}
