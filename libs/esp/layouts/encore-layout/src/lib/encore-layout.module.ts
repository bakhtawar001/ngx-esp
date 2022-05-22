import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EncoreLayoutComponent } from './encore-layout.component';

@NgModule({
  declarations: [EncoreLayoutComponent],
  imports: [CommonModule, RouterModule],
  exports: [EncoreLayoutComponent],
})
export class EncoreLayoutModule {}
