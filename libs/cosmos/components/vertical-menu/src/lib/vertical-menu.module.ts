import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosButtonModule } from '@cosmos/components/button';
import { NavigationModule } from '@cosmos/layout';
import { CosVerticalMenuComponent } from './vertical-menu.component';
@NgModule({
  imports: [
    A11yModule,
    CommonModule,
    NavigationModule,
    CosButtonModule,
    MatMenuModule,
  ],
  exports: [CosVerticalMenuComponent],
  declarations: [CosVerticalMenuComponent],
})
export class CosVerticalMenuModule {}
