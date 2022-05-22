import { NgModule } from '@angular/core';
import { CosTableComponent } from './table.component';
import { CdkTableModule } from '@angular/cdk/table';
import {
  CosCellDirective,
  CosCellDefDirective,
  CosColumnDefDirective,
  CosFooterCellDirective,
  CosFooterCellDefDirective,
  CosHeaderCellDirective,
  CosHeaderCellDefDirective,
} from './cell.directive';
import {
  CosFooterRowComponent,
  CosFooterRowDefDirective,
  CosHeaderRowComponent,
  CosHeaderRowDefDirective,
  CosRowComponent,
  CosRowDefDirective,
  CosNoDataRowDirective,
} from './row.component';
import { CosTextColumnComponent } from './text-column.component';

const EXPORTED_DECLARATIONS = [
  // Table
  CosTableComponent,

  // Template defs
  CosHeaderCellDefDirective,
  CosHeaderRowDefDirective,
  CosColumnDefDirective,
  CosCellDefDirective,
  CosRowDefDirective,
  CosFooterCellDefDirective,
  CosFooterRowDefDirective,

  // Cell directives
  CosHeaderCellDirective,
  CosCellDirective,
  CosFooterCellDirective,

  // Row directives
  CosFooterRowComponent,
  CosHeaderRowComponent,
  CosRowComponent,
  CosNoDataRowDirective,

  CosTextColumnComponent,
];

@NgModule({
  imports: [CdkTableModule],
  exports: [CdkTableModule, ...EXPORTED_DECLARATIONS],
  declarations: EXPORTED_DECLARATIONS,
})
export class CosTableModule {}
