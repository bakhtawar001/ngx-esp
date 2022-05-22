import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CosPillDirective } from './pill.directive';
import { CosPillLabelDirective } from './pill.directive';

@NgModule({
  imports: [CommonModule],
  exports: [CosPillDirective, CosPillLabelDirective],
  declarations: [CosPillDirective, CosPillLabelDirective],
})
export class CosPillModule {}
