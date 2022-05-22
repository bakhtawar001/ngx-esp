import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CosFeaturesComponent } from './features.component';
import { CosCardModule } from '@cosmos/components/card';

@NgModule({
  imports: [CommonModule, CosCardModule],
  exports: [CosFeaturesComponent],
  declarations: [CosFeaturesComponent],
})
export class CosFeaturesModule {}
