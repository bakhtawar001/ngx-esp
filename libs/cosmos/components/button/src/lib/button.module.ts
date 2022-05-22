import { NgModule } from '@angular/core';

import { CosAnchorComponent, CosButtonComponent } from './button.component';

@NgModule({
  declarations: [CosButtonComponent, CosAnchorComponent],
  exports: [CosButtonComponent, CosAnchorComponent],
})
export class CosButtonModule {}
