import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardMenuComponent } from './card-menu.component';
import { CosCardComponent, CosCardControlsComponent } from './card.component';

@NgModule({
  imports: [CommonModule, MatMenuModule, CosButtonModule],
  exports: [CosCardComponent, CosCardControlsComponent, CosCardMenuComponent],
  declarations: [
    CosCardComponent,
    CosCardControlsComponent,
    CosCardMenuComponent,
  ],
})
export class CosCardModule {}
