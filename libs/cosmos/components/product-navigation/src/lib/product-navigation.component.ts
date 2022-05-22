import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cos-product-navigation',
  templateUrl: 'product-navigation.component.html',
  styleUrls: ['product-navigation.component.scss'],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'cos-product-navigation',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosProductNavigationComponent implements OnInit, OnDestroy {
  @Input() products: any[] = [];
  @Input() selectedProductId!: number;
  @Input() backLinkText!: string;

  @Output() private goBack = new EventEmitter<void>();

  private elementRef: ElementRef;
  private zone: NgZone;
  private observer: IntersectionObserver | null = null;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    elementRef: ElementRef,
    zone: NgZone
  ) {
    this.elementRef = elementRef;
    this.zone = zone;
    this.observer = null;
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        ([e]) =>
          e.target.classList.toggle('is-docked', e.intersectionRatio < 1),
        { rootMargin: '-69px 0px 0px 0px', threshold: [1] }
      );

      this.observer.observe(this.elementRef.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  navigateBack() {
    this.goBack.emit();
  }

  navigateToProduct(product: any): void {
    this._router.navigate(['../../product', product.Id], {
      relativeTo: this._route,
    });
  }
}
