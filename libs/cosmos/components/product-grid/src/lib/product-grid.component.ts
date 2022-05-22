// The `ts-ignore` is added explicitly since it may take a lot of time to apply custom typings for `.jpg` files,
// for instance `declare module '*.jpg' { ... }`.
// @ts-ignore
import notFoundImageUrl from '!!file-loader?name=[name].[contenthash].jpg!../../../../assets/images/image_not_found.jpg';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Product } from '@smartlink/models';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ImageUrlPipe } from '@smartlink/products';
import { startWith } from 'rxjs/operators';

// The `notFoundImageUrl` will be actual URL to the image, e.g. `image_not_found.82952555d8ac87220e58f27f269e6a97.jpg`.

@Component({
  selector: 'cos-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss'],
  providers: [ImageUrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosProductGridComponent {
  @Input() products!: any[];
  @Input() productCount!: number;
  @Input() transformImageUrl = true;

  @ViewChild('gridContainer', { static: true })
  gridContainer!: ElementRef<HTMLElement>;

  @ViewChildren('img')
  images!: QueryList<ElementRef<HTMLImageElement>>;

  constructor(private imageUrlPipe: ImageUrlPipe) {}

  onImageError(event: ErrorEvent) {
    const target = <HTMLImageElement>event.target;
    target.src = notFoundImageUrl;
  }

  setImageUrls(): void {
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this.images.changes.pipe(startWith(this.images)).subscribe(() => {
      const images = this.images.toArray();
      // We can't associate an `<img>` element with the product itself. We can't loop `products` since there can be
      // more than 7 products, but we render only 7 products.
      for (let index = 0; index < images.length; index++) {
        const { nativeElement } = images[index];
        const { ImageUrl } = this.products[index];
        nativeElement.src = this.transformImageUrl
          ? this.imageUrlPipe.transform(ImageUrl)
          : ImageUrl;
      }
    });
  }

  trackByFn(index: number, product: Product): string | number {
    return product.ImageUrl ?? index;
  }
}
