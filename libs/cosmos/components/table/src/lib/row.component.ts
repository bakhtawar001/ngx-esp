import {
  CDK_ROW_TEMPLATE,
  CdkFooterRow,
  CdkFooterRowDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
} from '@angular/cdk/table';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  HostBinding,
} from '@angular/core';

/**
 * Header row definition for the cos-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
@Directive({
  selector: '[cosHeaderRowDef]',
  providers: [
    { provide: CdkHeaderRowDef, useExisting: CosHeaderRowDefDirective },
  ],
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['columns: cosHeaderRowDef'],
})
export class CosHeaderRowDefDirective extends CdkHeaderRowDef {}

/**
 * Footer row definition for the cos-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
@Directive({
  selector: '[cosFooterRowDef]',
  providers: [
    { provide: CdkFooterRowDef, useExisting: CosFooterRowDefDirective },
  ],
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['columns: cosFooterRowDef'],
})
export class CosFooterRowDefDirective extends CdkFooterRowDef {}

/**
 * Data row definition for the cos-table.
 * Captures the data row's template and other properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
@Directive({
  selector: '[cosRowDef]',
  providers: [{ provide: CdkRowDef, useExisting: CosRowDefDirective }],
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['columns: cosRowDefColumns', 'when: cosRowDefWhen'],
})
export class CosRowDefDirective<T> extends CdkRowDef<T> {}

/** Header template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'cos-header-row, tr[cos-header-row]',
  template: CDK_ROW_TEMPLATE,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // eslint-disable-next-line
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [{ provide: CdkHeaderRow, useExisting: CosHeaderRowComponent }],
})
export class CosHeaderRowComponent extends CdkHeaderRow {
  @HostBinding('class') mainClass = 'cos-header-row';
  @HostBinding('attr.role') attrRole = 'row';
}

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'cos-footer-row, tr[cos-footer-row]',
  template: CDK_ROW_TEMPLATE,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // eslint-disable-next-line
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [{ provide: CdkFooterRow, useExisting: CosFooterRowComponent }],
})
export class CosFooterRowComponent extends CdkFooterRow {
  @HostBinding('class') mainClass = 'cos-footer-row';
  @HostBinding('attr.role') attrRole = 'row';
}

/** Data row template container that contains the cell outlet. Adds the right class and role. */
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'cos-row, tr[cos-row]',
  template: CDK_ROW_TEMPLATE,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [{ provide: CdkRow, useExisting: CosRowComponent }],
})
export class CosRowComponent extends CdkRow {
  @HostBinding('class') mainClass = 'cos-row';
  @HostBinding('attr.role') attrRole = 'row';
}

/** Row that can be used to display a message when no data is shown in the table. */
/** TODO: Extend cdkRow when it becomes available in the CDK */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ng-template[cdkNoDataRow]',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class CdkNoDataRow {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({
  selector: 'ng-template[cosNoDataRow]',
  providers: [{ provide: CdkNoDataRow, useExisting: CosNoDataRowDirective }],
})
export class CosNoDataRowDirective extends CdkNoDataRow {}
