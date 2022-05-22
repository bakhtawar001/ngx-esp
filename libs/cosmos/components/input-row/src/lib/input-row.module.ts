import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosInputRowComponent } from './input-row.component';

@NgModule({
  imports: [CommonModule, CosButtonModule],
  exports: [CosInputRowComponent],
  declarations: [CosInputRowComponent],
})
export class CosInputRowModule {}
