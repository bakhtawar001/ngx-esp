import { Directive, ElementRef, Input, HostBinding } from '@angular/core';
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkFooterCell,
  CdkFooterCellDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
} from '@angular/cdk/table';

/**
 * Cell definition for the cos-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
@Directive({
  selector: '[cosCellDef]',
  providers: [{ provide: CdkCellDef, useExisting: CosCellDefDirective }],
})
export class CosCellDefDirective extends CdkCellDef {}

/**
 * Header cell definition for the cos-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[cosHeaderCellDef]',
  providers: [
    { provide: CdkHeaderCellDef, useExisting: CosHeaderCellDefDirective },
  ],
})
export class CosHeaderCellDefDirective extends CdkHeaderCellDef {}

/**
 * Footer cell definition for the cos-table.
 * Captures the template of a column's footer cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[cosFooterCellDef]',
  providers: [
    { provide: CdkFooterCellDef, useExisting: CosFooterCellDefDirective },
  ],
})
export class CosFooterCellDefDirective extends CdkFooterCellDef {}

/**
 * Column definition for the cos-table.
 * Defines a set of cells available for a table column.
 */
@Directive({
  selector: '[cosColumnDef]',
  providers: [
    { provide: CdkColumnDef, useExisting: CosColumnDefDirective },
    {
      provide: 'COS_SORT_HEADER_COLUMN_DEF',
      useExisting: CosColumnDefDirective,
    },
  ],
})
export class CosColumnDefDirective extends CdkColumnDef {
  /** Unique name for this column. */
  @Input()
  set cosColumnDef(name: string) {
    this.name = name;
  }
}

/** Header cell template container that adds the right classes and role. */
@Directive({
  selector: 'cos-header-cell, th[cos-header-cell]',
})
export class CosHeaderCellDirective extends CdkHeaderCell {
  @HostBinding() class = 'cos-header-cell';
  @HostBinding('attr.role') attrRol = 'columnheader';
  constructor(columnDef: CdkColumnDef, elementRef: ElementRef<HTMLElement>) {
    super(columnDef, elementRef);
    elementRef.nativeElement.classList.add(
      `cos-column-${columnDef.cssClassFriendlyName}`
    );
  }
}

/** Footer cell template container that adds the right classes and role. */
@Directive({
  selector: 'cos-footer-cell, td[cos-footer-cell]',
})
export class CosFooterCellDirective extends CdkFooterCell {
  @HostBinding() class = 'cos-footer-cell';
  @HostBinding('attr.role') attrRol = 'gridcell';
  constructor(columnDef: CdkColumnDef, elementRef: ElementRef) {
    super(columnDef, elementRef);
    elementRef.nativeElement.classList.add(
      `cos-column-${columnDef.cssClassFriendlyName}`
    );
  }
}

/** Cell template container that adds the right classes and role. */
@Directive({
  selector: 'cos-cell, td[cos-cell]',
})
export class CosCellDirective extends CdkCell {
  @HostBinding() class = 'cos-cell';
  @HostBinding('attr.role') attrRol = 'gridcell';
  constructor(columnDef: CdkColumnDef, elementRef: ElementRef<HTMLElement>) {
    super(columnDef, elementRef);
    elementRef.nativeElement.classList.add(
      `cos-column-${columnDef.cssClassFriendlyName}`
    );
  }
}
