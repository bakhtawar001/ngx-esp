import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fromEvent } from 'rxjs';

export interface Coord {
  x: number;
  y: number;
}

export const enum ZoomMode {
  HOVER,
  TOGGLE,
  CLICK,
  HOVER_FREEZE,
}

@UntilDestroy()
@Component({
  selector: 'cos-image-zoom',
  templateUrl: './image-zoom.component.html',
  styleUrls: ['./image-zoom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosImageZoomComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  // Private

  private _thumbImage!: string;
  private _fullImage!: string;

  private _magnification = 1.5;
  private _baseRatio = 0;
  private _minZoomRatio!: number;
  private _maxZoomRatio = 2;

  private xRatio!: number;
  private yRatio!: number;
  private offsetLeft!: number;
  private offsetTop!: number;
  private zoomingEnabled = false;
  private zoomFrozen = false;
  private isReady = false;
  private thumbImageLoaded = false;
  private fullImageLoaded = false;

  private latestMouseLeft!: number;
  private latestMouseTop!: number;
  private scrollParent!: Element;

  private unlisteners: VoidFunction[] = [];

  @Input() zoomMode = ZoomMode.HOVER;
  @Input() circularLens = false;
  @Input() alt: string | null = null;

  @Input() isInsideStaticContainer = false;

  @Input() enableScrollZoom = false;

  @Input() scrollStepSize = 0.1;

  @Input() enableLens = false;
  @Input() lensWidth = 100;
  @Input() lensHeight = 100;

  @Output() readonly ZoomScrollChange = new EventEmitter<number>();
  @Output() readonly ZoomPositionChange = new EventEmitter<Coord>();

  @ViewChild('zoomContainer', { static: true })
  zoomContainer!: ElementRef<HTMLElement>;

  @ViewChild('imageThumbnail', { static: true })
  imageThumbnail!: ElementRef<HTMLImageElement>;

  @ViewChild('fullSizeImageWrapper', { static: true })
  fullSizeImageWrapper!: ElementRef<HTMLElement>;

  @ViewChild('fullSizeImage', { static: true })
  fullSizeImage!: ElementRef<HTMLImageElement>;

  private fullImageTop: number | null = null;
  private fullImageLeft: number | null = null;

  private magnifiedWidth: number | null = null;
  private magnifiedHeight: number | null = null;

  private lensTop: number | null = null;
  private lensLeft: number | null = null;
  private lensBorderRadius = 0;

  thumbWidth!: number;
  thumbHeight!: number;
  fullWidth!: number;
  fullHeight!: number;

  constructor(
    private ngZone: NgZone,
    private renderer: Renderer2,
    private host: ElementRef<HTMLElement>
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------
  @Input() set thumbImage(url: string) {
    this.thumbImageLoaded = false;
    this.isReady = false;
    this._thumbImage = url;
  }

  get thumbImage() {
    return this._thumbImage;
  }

  @Input() set fullImage(url: string) {
    this.fullImageLoaded = false;
    this.isReady = false;
    this._fullImage = url;
  }

  get fullImage() {
    return this._fullImage;
  }

  @Input()
  set magnification(value: number) {
    if (value > 0) {
      this._magnification = value;
      this.ZoomScrollChange.emit(this._magnification);
    }
  }

  @Input()
  set minZoomRatio(value: number) {
    const ratio = value || this._minZoomRatio || this._baseRatio;
    this._minZoomRatio = Math.max(ratio, this._baseRatio);
  }

  @Input()
  set maxZoomRatio(value: number) {
    this._maxZoomRatio = value > 0 ? value : this._maxZoomRatio;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit() {
    const container = this.zoomContainer.nativeElement;

    if (this.zoomMode === ZoomMode.HOVER) {
      this.ngZone.runOutsideAngular(() => {
        fromEvent<MouseEvent>(container, 'mouseenter')
          .pipe(untilDestroyed(this))
          .subscribe((event) => this.zoomOn(event));

        fromEvent(container, 'mouseleave')
          .pipe(untilDestroyed(this))
          .subscribe(() => this.zoomOff());

        fromEvent<MouseEvent>(container, 'mousemove')
          .pipe(untilDestroyed(this))
          .subscribe((event) => this.calculateZoomPosition(event));
      });
    } else if (this.zoomMode === ZoomMode.TOGGLE) {
      this.unlisteners.push(
        this.renderer.listen(container, 'click', (e) => this.toggleClick(e))
      );
    } else if (this.zoomMode === ZoomMode.CLICK) {
      this.unlisteners.push(
        this.renderer.listen(container, 'click', (e) => this.clickStarter(e)),
        this.renderer.listen(container, 'mouseleave', () =>
          this.clickMouseLeave()
        ),
        this.renderer.listen(container, 'mousemove', (e) =>
          this.clickMouseMove(e)
        )
      );
    } else if (this.zoomMode === ZoomMode.HOVER_FREEZE) {
      this.unlisteners.push(
        this.renderer.listen(container, 'mouseenter', (e) =>
          this.hoverFreezeMouseEnter(e)
        ),
        this.renderer.listen(container, 'mouseleave', () =>
          this.hoverFreezeMouseLeave()
        ),
        this.renderer.listen(container, 'mousemove', (e) =>
          this.hoverFreezeMouseMove(e)
        ),
        this.renderer.listen(container, 'click', (e) =>
          this.hoverFreezeClick(e)
        )
      );
    }

    this.setupScrollListeners();
    this.setupEventListeners();
    this.calculateLensBorderRadius();
  }

  ngOnChanges() {
    this.calculateLensBorderRadius();
    this.calculateRatioAndOffset();
    this.calculateImageAndLensPosition();
  }

  ngAfterViewInit(): void {
    this.scrollParent = this.host.nativeElement.parentElement!;
  }

  ngOnDestroy(): void {
    while (this.unlisteners.length) {
      this.unlisteners.pop()!();
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Zoom position setters
   */
  private setZoomPosition(left: number, top: number) {
    this.latestMouseLeft = Number(left) || this.latestMouseLeft;
    this.latestMouseTop = Number(top) || this.latestMouseTop;

    const c: Coord = {
      x: this.latestMouseLeft,
      y: this.latestMouseTop,
    };

    this.ZoomPositionChange.emit(c);
  }

  /**
   * Toggle mode
   */
  private toggleClick(event: MouseEvent) {
    if (this.zoomingEnabled) {
      this.zoomOff();
    } else {
      this.zoomOn(event);
    }

    this.zoomingEnabled = !this.zoomingEnabled;
  }

  /**
   * Click mode
   */
  private clickStarter(event: MouseEvent) {
    if (!this.zoomingEnabled) {
      this.zoomingEnabled = true;
      this.zoomOn(event);
    }
  }

  private clickMouseLeave() {
    this.zoomOff();
    this.zoomingEnabled = false;
  }

  private clickMouseMove(event: MouseEvent) {
    if (this.zoomingEnabled) {
      this.calculateZoomPosition(event);
    }
  }

  /**
   * Hover freeze mode
   */
  private hoverFreezeMouseEnter(event: MouseEvent) {
    if (this.zoomingEnabled && !this.zoomFrozen) {
      this.zoomOn(event);
    }
  }

  private hoverFreezeMouseLeave() {
    if (this.zoomingEnabled && !this.zoomFrozen) {
      this.zoomOff();
    }
  }

  private hoverFreezeMouseMove(event: MouseEvent) {
    if (this.zoomingEnabled && !this.zoomFrozen) {
      this.calculateZoomPosition(event);
    }
  }

  private hoverFreezeClick(event: MouseEvent) {
    if (this.zoomingEnabled && this.zoomFrozen) {
      this.zoomingEnabled = false;
      this.zoomFrozen = false;
      this.zoomOff();
    } else if (this.zoomingEnabled) {
      this.zoomFrozen = true;
    } else {
      this.zoomingEnabled = true;
      this.zoomOn(event);
    }
  }

  /**
   * Private helper methods
   */
  private zoomOn(event: MouseEvent) {
    if (this.isReady) {
      this.calculateRatioAndOffset();
      this.setFullSizeImageWrapper('block');
      this.calculateZoomPosition(event);
    }
  }

  private zoomOff() {
    this.setFullSizeImageWrapper('none');
  }

  private calculateZoomPosition(event: MouseEvent) {
    let scrollLeftOffset = 0;
    let scrollTopOffset = 0;
    if (this.scrollParent !== null) {
      scrollLeftOffset = this.scrollParent.scrollLeft;
      scrollTopOffset = this.scrollParent.scrollTop;
    }

    const left = event.pageX - this.offsetLeft + scrollLeftOffset;
    let top = event.pageY - this.offsetTop + scrollTopOffset;

    if (this.isInsideStaticContainer) {
      top -= document.documentElement.scrollTop;
    }

    const newLeft = Math.max(Math.min(left, this.thumbWidth), 0);
    const newTop = Math.max(Math.min(top, this.thumbHeight), 0);

    this.setZoomPosition(newLeft, newTop);

    this.calculateImageAndLensPosition();
  }

  private calculateImageAndLensPosition() {
    let lensLeftMod = 0,
      lensTopMod = 0;

    if (this.enableLens) {
      lensLeftMod = this.lensLeft = this.latestMouseLeft - this.lensWidth / 2;
      lensTopMod = this.lensTop = this.latestMouseTop - this.lensHeight / 2;
    }

    this.fullImageLeft = this.latestMouseLeft * -this.xRatio - lensLeftMod;
    this.fullImageTop = this.latestMouseTop * -this.yRatio - lensTopMod;
    // [style.top.px]="fullImageTop"
    this.fullSizeImage.nativeElement.style.top = `${this.fullImageTop}px`;
    // [style.left.px]="fullImageLeft"
    this.fullSizeImage.nativeElement.style.left = `${this.fullImageLeft}px`;
  }

  private calculateRatioAndOffset() {
    if (this.imageThumbnail) {
      this.thumbWidth = this.imageThumbnail.nativeElement.width;
      this.thumbHeight = this.imageThumbnail.nativeElement.height;
    }

    // If lens is disabled, set lens size to equal thumb size and position it on top of the thumb
    if (!this.enableLens) {
      this.lensWidth = this.thumbWidth;
      this.lensHeight = this.thumbHeight;
      this.lensLeft = 0;
      this.lensTop = 0;
      // [style.width.px]="lensWidth"
      this.fullSizeImageWrapper.nativeElement.style.width = `${this.lensWidth}px`;
      // [style.height.px]="lensHeight"
      this.fullSizeImageWrapper.nativeElement.style.height = `${this.lensHeight}px`;
      // [style.left.px]="lensLeft"
      this.fullSizeImageWrapper.nativeElement.style.left = `${this.lensLeft}px`;
      // [style.top.px]="lensTop"
      this.fullSizeImageWrapper.nativeElement.style.top = `${this.lensTop}px`;
    }

    // getBoundingClientRect() ? https://stackoverflow.com/a/44008873
    this.offsetTop = this.zoomContainer.nativeElement.offsetTop;
    this.offsetLeft = this.zoomContainer.nativeElement.offsetLeft;
    // If we have an offsetParent, we need to add its offset too and recurse until we can't find more offsetParents.
    let parentContainer = <HTMLElement | null>(
      this.zoomContainer.nativeElement.offsetParent
    );
    while (parentContainer !== null) {
      this.offsetTop += parentContainer.offsetTop;
      this.offsetLeft += parentContainer.offsetLeft;
      parentContainer = <HTMLElement | null>parentContainer.offsetParent;
    }

    if (this.fullImage === undefined) {
      this.fullImage = this._thumbImage;
    }

    if (this.fullImageLoaded) {
      this.fullWidth = this.fullSizeImage.nativeElement.naturalWidth;
      this.fullHeight = this.fullSizeImage.nativeElement.naturalHeight;

      this._baseRatio = Math.max(
        this.thumbWidth / this.fullWidth,
        this.thumbHeight / this.fullHeight
      );

      // Don't allow zooming to smaller than thumbnail size
      this._minZoomRatio = Math.max(this._minZoomRatio, this._baseRatio);

      this.calculateRatio();
    }
  }

  private calculateRatio() {
    this.magnifiedWidth = this.fullWidth * this._magnification;
    this.magnifiedHeight = this.fullHeight * this._magnification;

    // [style.width.px]="magnifiedWidth"
    this.fullSizeImage.nativeElement.style.width = `${this.magnifiedWidth}px`;
    // [style.height.px]="magnifiedHeight"
    this.fullSizeImage.nativeElement.style.height = `${this.magnifiedHeight}px`;

    this.xRatio = (this.magnifiedWidth - this.thumbWidth) / this.thumbWidth;
    this.yRatio = (this.magnifiedHeight - this.thumbHeight) / this.thumbHeight;
  }

  private calculateLensBorderRadius(): void {
    this.lensBorderRadius =
      this.enableLens && this.circularLens ? this.lensWidth / 2 : 0;
    // [style.border-radius.px]="lensBorderRadius"
    this.fullSizeImageWrapper.nativeElement.style.borderRadius = `${this.lensBorderRadius}px`;
  }

  private setupScrollListeners(): void {
    if (!this.enableScrollZoom) {
      return;
    }

    function getWheelDelta(event: WheelEvent): number {
      // The `wheelDelta` has been deprecated.
      return (event as { wheelDelta?: number }).wheelDelta || -event.detail;
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();

      const direction = Math.max(Math.min(getWheelDelta(event), 1), -1);

      if (direction > 0) {
        // up
        this._magnification = Math.min(
          this._magnification + this.scrollStepSize,
          this._maxZoomRatio
        );
      } else {
        // down
        this._magnification = Math.max(
          this._magnification - this.scrollStepSize,
          this._minZoomRatio
        );
      }

      this.calculateRatio();
      this.calculateZoomPosition(event);
    };

    this.ngZone.runOutsideAngular(() => {
      fromEvent<WheelEvent>(
        this.zoomContainer.nativeElement,
        getWheelEventName(this.zoomContainer.nativeElement)
      )
        .pipe(untilDestroyed(this))
        .subscribe((event) => {
          onWheel(event);
        });
    });
  }

  private setupEventListeners(): void {
    const checkImagesLoaded = () => {
      this.calculateRatioAndOffset();
      if (this.thumbImageLoaded && this.fullImageLoaded) {
        this.calculateImageAndLensPosition();
        this.isReady = true;
      }
    };

    this.ngZone.runOutsideAngular(() => {
      fromEvent(this.imageThumbnail.nativeElement, 'load')
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          this.thumbImageLoaded = true;
          checkImagesLoaded();
        });

      fromEvent(this.fullSizeImage.nativeElement, 'load')
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          this.fullImageLoaded = true;
          checkImagesLoaded();
        });
    });
  }

  private setFullSizeImageWrapper(display: string): void {
    // [style.display]="display"
    this.fullSizeImageWrapper.nativeElement.style.display = display;
  }
}

function getWheelEventName(container: HTMLElement) {
  if ('onwheel' in container) {
    // This event replaces the non-standard deprecated `mousewheel` event.
    return 'wheel';
  } else if ('onmousewheel' in container) {
    // Deprecated: This feature is no longer recommended (not supported in Firefox).
    return 'mousewheel';
  } else if ('onDOMMouseScroll' in container || 'DOMMouseScroll' in container) {
    // Deprecated: This feature is no longer recommended (Firefox only).
    return 'DOMMouseScroll';
  } else {
    return 'wheel';
  }
}
