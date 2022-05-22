import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CosAttributeTagDirective } from './attribute-tag.directive';

@NgModule({
  declarations: [CosAttributeTagDirective],
  imports: [CommonModule],
  exports: [CosAttributeTagDirective],
})
export class CosAttributeTagModule {}
