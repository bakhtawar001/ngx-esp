import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgModule,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { unpatchedFromEvent } from '@cosmos/zone-less';
import { observeElementInViewport } from '@cosmos/core';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import imageNotInCatalogUrl from '!!file-loader?name=[name].[contenthash].jpg!../../../../../../cosmos/assets/images/image_not_in_catalog.png';

// The `imageNotInCatalogUrl` will be actual URL to the image, e.g. `mage_not_in_catalog.92ede7f05b8f51dc3353c199f5c811db.jpg`.

type ImageSize = 'small' | 'normal' | 'large';

@UntilDestroy()
@Component({
  selector: 'esp-product-image',
  templateUrl: './product-image.component.html',
  styleUrls: ['./product-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductImageComponent implements OnInit, OnChanges {
  @Input() product: any;
  @Input() baseUrl = 'https://api.asicentral.com/v1';
  @Input() imgSrc?: string;
  @Input() imgAlt?: string;
  @Input() imgContainerClass: string | null = null;
  @Input() size: ImageSize = 'normal';

  @ViewChild('imgContainer', { static: true })
  imgContainer!: ElementRef<HTMLElement>;

  @ViewChild('img', { static: false })
  set img(img: ElementRef<HTMLImageElement> | undefined) {
    // This will equal `undefined` when the first render passes since it's inside the `ngIf`.
    if (img) {
      this.setupImageListeners(img.nativeElement);
    }
  }

  imgUrl: string | null = null;
  loading = true;
  isInViewport = false;

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    if (!this.imgSrc && this.product) {
      this.imgSrc =
        this.product?.ImageUrl ||
        this.product?.VirtualSampleImages?.[0]?.ImageUrl;
    }

    this.imgUrl = this.getImageUrl(this.imgSrc);
    this.setupIntersectionObserver();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.imgSrc) {
      this.imgUrl = this.getImageUrl(changes.imgSrc.currentValue);
    }
  }

  private setupIntersectionObserver(): void {
    // We're using the `IntersectionObserver` to render the `<img>` element only when the image container appears
    // inside the viewport. We do have many product images on the collections page that forces to load all images at
    // once even if the user doesn't see them inside the viewport.
    observeElementInViewport(this.imgContainer.nativeElement)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        // The `observeElementInViewport` uses the unpatched `IntersectionObserver` which will execute the `observer.next`
        // inside the `<root>` zone. Since many product images could've triggered many global change detections. We set up
        // the `IntersectionObserver` and run the local change detection when the observable emits to render the `<img>` element.
        // This will allow us to load the image only when the user scrolls down.
        this.isInViewport = true;
        this.ref.detectChanges();
      });
  }

  private getImageUrl(img: string | undefined): string {
    return `${this.baseUrl}/${img}?size=${this.size}`;
  }

  private setupImageListeners(img: HTMLImageElement): void {
    // Caretaker note: we're adding the `load` event listener manually and not through the
    // template(`img (load)="..."`) because any template event listener triggers change detection.
    // It also calls `markDirty()`; hence the change detection consistently runs from the root component down to this one.
    unpatchedFromEvent(img, 'load')
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.loading = false;
        // We don't need to re-enter Angular's zone for this change detection.
        // This will be a local change detection that will remove the `.esp-loader`.
        this.ref.detectChanges();
      });

    unpatchedFromEvent(img, 'error')
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        img.src = imageNotInCatalogUrl;
      });
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [ProductImageComponent],
  exports: [ProductImageComponent],
})
export class ProductImageComponentModule {}
