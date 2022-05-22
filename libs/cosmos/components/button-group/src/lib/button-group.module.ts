import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { CosButtonGroupComponent } from './button-group.component';

@NgModule({
  imports: [CommonModule, MatButtonToggleModule],
  declarations: [CosButtonGroupComponent],
  exports: [CosButtonGroupComponent],
})
export class CosButtonGroupModule {}
