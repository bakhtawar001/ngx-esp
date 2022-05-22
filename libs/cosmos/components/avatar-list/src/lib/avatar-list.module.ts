import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CosAvatarListComponent } from './avatar-list/avatar-list.component';

@NgModule({
  imports: [CommonModule, CosAvatarModule, MatTooltipModule],
  exports: [CosAvatarListComponent],
  declarations: [CosAvatarListComponent],
})
export class CosAvatarListModule {}
