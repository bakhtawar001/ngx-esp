import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosButtonModule } from '@cosmos/components/button';
import { CosExploreBarComponent } from './explore-bar.component';

@NgModule({
  imports: [CommonModule, CosButtonModule, MatMenuModule],
  exports: [CosExploreBarComponent],
  declarations: [CosExploreBarComponent],
})
export class CosExploreBarModule {}
