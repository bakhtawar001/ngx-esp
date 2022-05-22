import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  CosAnalyticsService,
  CosHoverEventModule,
  TrackEvent,
} from '@cosmos/analytics';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosCardModule } from '@cosmos/components/card';
import type { ProductCard } from '@cosmos/components/product-card';
import { CosProductCardModule } from '@cosmos/components/product-card';
import { CosSupplierModule } from '@cosmos/components/supplier';
import { ProductTrackEvent, SourceTrackEvent } from '@esp/products';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ProductCardEvent } from '../../types';
import { getAdInfo } from '../../utils';

@UntilDestroy()
@Component({
  selector: 'esp-product-gallery',
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProductGalleryComponent {
  //--------------------------------------------------------------------------------------------------------------
  // @Public Accessors
  //----------------------------------------------------------------------------------------------------------------
  @Input() products: ProductCard[];
  @Input() source: SourceTrackEvent;
  @Output() clicked: EventEmitter<ProductCardEvent<ProductCard>> =
    new EventEmitter();

  //---------------------------------------------------------------------------------------------------------------
  // @Constructor
  //-----------------------------------------------------------------------------------------------------------------
  constructor(private route: Router, private _analytics: CosAnalyticsService) {}

  //-----------------------------------------------------------------------------------------------------------------
  // @Public Methods
  //-------------------------------------------------------------------------------------------------------------------

  goToSupplier(id: number): void {
    this.route.navigate(['/suppliers', id]);
  }
  productHovered(productCard: ProductCard): void {
    const hoverEvent: TrackEvent<ProductTrackEvent> = {
      action: 'Product Hovered',
      properties: {
        currencyCode: productCard.Price?.CurrencyCode,
        id: productCard.Id,
        ad: getAdInfo(productCard.Ad),
        source: this.source,
        marketSegmentCode: 'ALL',
      },
    };

    this._analytics.trackHover(hoverEvent);
  }
}

@NgModule({
  declarations: [ProductGalleryComponent],
  imports: [
    CommonModule,
    RouterModule,

    CosAttributeTagModule,
    CosProductCardModule,
    CosSupplierModule,
    CosCardModule,
    CosHoverEventModule,
  ],
  exports: [ProductGalleryComponent],
})
export class ProductGalleryComponentModule {}
