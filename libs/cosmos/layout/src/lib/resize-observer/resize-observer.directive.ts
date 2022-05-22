import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ResizeObserverService } from './resize-observer.service';

@Directive({
  selector: '[cosOnResize]',
})
export class ResizeObserverDirective
  implements AfterViewInit, OnChanges, OnDestroy {
  @Input() resizeObserverOptions?: ResizeObserverOptions;
  @Output() readonly cosOnResize = new EventEmitter<ResizeObserverEntry>();

  /**
   *
   * @param {ElementRef} _elementRef
   * @param {ResizeObserverService} _resizeObserverService
   */
  constructor(
    private readonly _elementRef: ElementRef,
    private readonly _resizeObserverService: ResizeObserverService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------
  get observing() {
    return this._resizeObserverService.isObserving(
      this._elementRef.nativeElement
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngAfterViewInit() {
    this.observe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.observing && (changes.resizeBoxModel || changes.cosOnResize)) {
      this.unobserve();
      this.observe();
    }
  }

  ngOnDestroy() {
    this.unobserve();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private observe() {
    if (!this.observing) {
      this._resizeObserverService.observe(
        this._elementRef.nativeElement,
        (resize) => this.cosOnResize.emit(resize),
        this.resizeObserverOptions
      );
    }
  }

  private unobserve() {
    this._resizeObserverService.unobserve(this._elementRef.nativeElement);
  }
}
