import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosProductCardTagsComponent } from './product-card-tags.component';

@NgModule({
  imports: [CommonModule, CosAttributeTagModule],
  declarations: [CosProductCardTagsComponent],
  exports: [CosProductCardTagsComponent],
})
export class CosProductCardTagsModule {}
