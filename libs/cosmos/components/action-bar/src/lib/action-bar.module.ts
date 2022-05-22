import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosButtonModule } from '@cosmos/components/button';
import { ClickOutsideModule } from '@cosmos/common';
import {
  CosActionBarComponent,
  CosActionBarControlsComponent,
} from './action-bar.component';

@NgModule({
  imports: [CommonModule, MatMenuModule, CosButtonModule, ClickOutsideModule],
  exports: [CosActionBarComponent, CosActionBarControlsComponent],
  declarations: [CosActionBarComponent, CosActionBarControlsComponent],
})
export class CosActionBarModule {}
