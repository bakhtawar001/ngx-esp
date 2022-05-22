import { Directionality } from '@angular/cdk/bidi';
import {
  _DisposeViewRepeaterStrategy,
  _ViewRepeater,
  _VIEW_REPEATER_STRATEGY,
} from '@angular/cdk/collections';
import { Platform } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  CdkTable,
  CDK_TABLE,
  CDK_TABLE_TEMPLATE,
  RenderRow,
  RowContext,
  StickyPositioningListener,
  STICKY_POSITIONING_LISTENER,
  _CoalescedStyleScheduler,
  _COALESCED_STYLE_SCHEDULER,
} from '@angular/cdk/table';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  IterableDiffers,
  Optional,
  Renderer2,
  SkipSelf,
  ViewEncapsulation,
} from '@angular/core';
/**
 * Wrapper for the CdkTable with Material design styles.
 */
@Component({
  selector: 'cos-table, table[cos-table]',
  template: CDK_TABLE_TEMPLATE,
  styleUrls: ['table.component.scss'],
  providers: [
    { provide: CdkTable, useExisting: CosTableComponent },
    { provide: CDK_TABLE, useExisting: CosTableComponent },
    {
      provide: _VIEW_REPEATER_STRATEGY,
      useClass: _DisposeViewRepeaterStrategy,
    },
    { provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
  ],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // eslint-disable-next-line
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CosTableComponent<T> extends CdkTable<T> implements AfterViewInit {
  @HostBinding('class.cos-table--striped')
  @Input()
  showStripes = false;

  @HostBinding('class.cos-table') mainClass = true;

  private tableWrapperElement: HTMLElement | null = null;

  constructor(
    private renderer: Renderer2,

    protected override readonly _differs: IterableDiffers,
    protected override readonly _changeDetectorRef: ChangeDetectorRef,
    protected override readonly _elementRef: ElementRef,
    @Attribute('role') role: string,
    @Optional() protected override readonly _dir: Directionality,
    @Inject(DOCUMENT) _document: any,
    _platform: Platform,
    @Inject(_VIEW_REPEATER_STRATEGY)
    protected override readonly _viewRepeater: _ViewRepeater<
      T,
      RenderRow<T>,
      RowContext<T>
    >,
    @Inject(_COALESCED_STYLE_SCHEDULER)
    protected override readonly _coalescedStyleScheduler: _CoalescedStyleScheduler,

    _viewportRuler: ViewportRuler,
    @Optional()
    @SkipSelf()
    @Inject(STICKY_POSITIONING_LISTENER)
    protected override readonly _stickyPositioningListener: StickyPositioningListener
  ) {
    super(
      _differs,
      _changeDetectorRef,
      _elementRef,
      role,
      _dir,
      _document,
      _platform,
      _viewRepeater,
      _coalescedStyleScheduler,
      _viewportRuler,
      _stickyPositioningListener
    );
  }
  ngAfterViewInit() {
    this.addScrollableWrapper();
  }

  addScrollableWrapper() {
    this.tableWrapperElement = this.renderer.createElement('div');
    this.tableWrapperElement!.classList.add('cos-table--wrapper');

    const el = this._elementRef.nativeElement; //this is the element to wrap
    const parent = el.parentNode; //this is the parent containing el
    this.renderer.insertBefore(parent, this.tableWrapperElement, el); //here we place div before el

    this.renderer.appendChild(this.tableWrapperElement, el); //here we place el in div
  }
}
