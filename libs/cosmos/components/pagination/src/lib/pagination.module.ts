import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { CosPaginationComponent } from './pagination.component';

@NgModule({
  imports: [CommonModule, MatPaginatorModule, MatDividerModule],
  declarations: [CosPaginationComponent],
  exports: [CosPaginationComponent],
})
export class CosPaginationModule {}
