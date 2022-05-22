import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CosPillModule } from '@cosmos/components/pill';
import { CosRelatedTopicsComponent } from './related-topics.component';

@NgModule({
  imports: [CommonModule, CosPillModule],
  exports: [CosRelatedTopicsComponent],
  declarations: [CosRelatedTopicsComponent],
})
export class CosRelatedTopicsModule {}
