import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import {
  CosAnalyticsService,
  CosTrackEventModule,
  TrackEvent,
} from '@cosmos/analytics';
import { CosAccordionModule } from '@cosmos/components/accordion';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { AttributeTag } from '@cosmos/components/product-card-tags';
import { CosProductMediaModule } from '@cosmos/components/product-media';
import { CosProductVariantsModule } from '@cosmos/components/product-variant-details';
import { CosSupplierModule } from '@cosmos/components/supplier';
import { FeatureFlagsModule } from '@cosmos/feature-flags';
import {
  AddProductsResponse,
  productToCollectionProduct,
} from '@esp/collections';
import { ProductCollectionTrackEvent } from '@esp/products';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AttributeValue, InventoryQuantity, Product } from '@smartlink/models';
import {
  FormatCPNPipeModule,
  FormatPriceRangePipeModule,
  Prop65PipeModule,
} from '@smartlink/products';
import type { Supplier } from '@smartlink/suppliers';
import { firstValueFrom } from 'rxjs';
import { CollectionsDialogService } from '../../../collections/services';
import { AddToPresentationFlow } from '../../../projects/flows/add-to-presentation.flow';
import { ProductsDialogService } from '../../services';
import { ProductImprintMethodsComponentModule } from '../product-imprint-methods';
import { ProductInfoComponentModule } from '../product-info';
import { ProductInventoryComponentModule } from '../product-inventory';
import { ProductMatrixComponentModule } from '../product-matrix';
import { ProductProductionShippingComponentModule } from '../product-production-shipping';
import { ProductRelatedComponentModule } from '../product-related';
import { ProductSafetyWarningsComponentModule } from '../product-safety-warnings';
import { ProductSpecialsComponentModule } from '../product-specials';

@UntilDestroy()
@Component({
  selector: 'esp-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  providers: [AddToPresentationFlow],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnChanges {
  static readonly DEFAULT_VISIBLE_COLORS = 12;

  @Input() product: Product;
  @Input() supplier: Supplier;
  @Input() media: any;
  @Input() inventory: InventoryQuantity[];

  private _colorMap;
  private selectedImage = 0;

  public productMedia: any[];
  public cosMediaProduct: any;
  public imprintAccordionExpanded = false;
  public productInfoAccordionExpanded = false;
  public productionShippingAccordionExpanded = false;
  public safetyWarningsAccordionExpanded = false;
  public showingAllColors = false;
  public isShowMoreColorsEnabled = false;
  public visibleColors = ProductDetailComponent.DEFAULT_VISIBLE_COLORS;

  constructor(
    private readonly _router: Router,
    private readonly _collectionModalService: CollectionsDialogService,
    private readonly _addToPresentationFlow: AddToPresentationFlow,
    private readonly _productsDialogService: ProductsDialogService,
    private readonly _analytics: CosAnalyticsService
  ) {
    this._router.events.pipe(untilDestroyed(this)).subscribe({
      next: (event) =>
        event instanceof NavigationEnd ? this.scrollTop() : null,
    });
  }

  get colorVariants() {
    return {
      options: this.product.Attributes?.Colors?.Values?.slice(
        0,
        this.visibleColors
      ),
    };
  }

  get sizeVariants() {
    return {
      options: this.product.Attributes?.Sizes?.Values,
    };
  }

  get imprintVariants() {
    return {
      options: this.product.Imprinting?.Methods?.Values,
    };
  }

  get priceVariants() {
    return (
      this.product.Variants ||
      (this.product.Prices && [{ Prices: this.product.Prices }])
    );
  }

  get prop65Warnings() {
    return this.product?.Warnings.filter((warning) => warning.Type === 'PROP');
  }

  get tags() {
    const _tags: { updates: AttributeTag[]; features: AttributeTag[] } = {
      updates: [],
      features: [],
    };
    const _madeInUSA = !!this.product.Origin?.find((origin) =>
      origin.match(/(USA|U\.S\.A)/)
    );
    const _todaysDate = new Date();
    const _updateDate = new Date(this.product.UpdateDate);
    const _dataFresh =
      (_todaysDate.getTime() - _updateDate.getTime()) / (1000 * 60 * 60 * 24) <=
      30;

    if (this.product.IsNew) {
      _tags.updates.push({
        Icon: 'fa-exclamation-circle',
        Label: 'New Product',
      });
    }

    if (_dataFresh) {
      _tags.updates.push({
        Icon: 'fa-sync-alt',
        Label: 'Data Fresh',
      });
    }

    if (this.product.Specials?.length) {
      _tags.updates.push({
        Icon: 'fa-tag',
        Label: this.product.Specials[0].Type,
      });
    }

    if (_madeInUSA) {
      _tags.features.push({ Icon: 'fa-flag-usa', Label: 'Made in USA' });
    }

    if (this.product.HasRushService) {
      _tags.features.push({
        Icon: 'fa-shipping-fast',
        Label: 'Rush Service available',
      });
    }

    return _tags;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._colorMap = this.getColorMap();
    if (changes.product?.previousValue !== changes.product?.currentValue) {
      this.productMedia = this.getProductMedia();
    }
    if (changes.media && changes.media.currentValue) {
      this.cosMediaProduct = {
        ...this.cosMediaProduct,
        Media: this.cosMediaProduct?.Media?.concat(changes.media.currentValue),
      };
    }

    this.isShowMoreColorsEnabled =
      this.product.Attributes?.Colors?.Values?.length >
      ProductDetailComponent.DEFAULT_VISIBLE_COLORS;
  }

  async addToCollection(): Promise<void> {
    const collectionProduct = productToCollectionProduct({
      ...this.product,
      ImageUrl: this.productMedia?.[this.selectedImage]?.Url,
    });

    const result: AddProductsResponse = await firstValueFrom(
      this._collectionModalService.addToCollection([collectionProduct])
    );

    if (result) {
      this.captureProductAddedEvent(
        result.Collection.Id,
        this.product.Id,
        result.ProductsDuplicated,
        result.ProductsTruncated
      );
    }
  }

  addToPresentation(): void {
    this._addToPresentationFlow.start({
      checkedProducts: new Map().set(this.product.Id, this.product),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async addToOrder(): Promise<void> {}

  getColorMap(): any {
    const _hash =
      this.product.Attributes?.Colors?.Values?.filter(
        // filter only where color has imageUrl
        (v: AttributeValue) => v.ImageUrl
      )?.map((i: AttributeValue) => ({ [i.ImageUrl]: i.Name })) || [];

    return Object.assign({}, ..._hash);
  }

  getProductMedia() {
    let media = [];
    if (this.product?.Images) {
      media = this.product.Images?.map((i) => {
        return {
          Url: i,
          Name: this._colorMap?.[i],
          // Alt:
          //   this.product.Name +
          //   (this._colorMap[i] ? ' - ' + this._colorMap[i] : ''),
          Type: 'IMG',
        };
      });
    } else {
      media = [
        {
          Url: this.product.ImageUrl,
          Name: '',
          Type: 'IMG',
        },
      ];
    }

    /* TEMPORARY */
    this.cosMediaProduct = {
      Id: this.product.Id,
      Name: this.product.Name,
      ImageUrl: this.product.ImageUrl,
      Media: media,
    };
    return media;
  }

  openInventoryDialog(): void {
    this._productsDialogService
      .openInventoryDialog({
        inventory: this.inventory,
      })
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  openPriceGridDialog(): void {
    this._productsDialogService
      .openPriceGridDialog({
        variants: this.priceVariants,
        preferred: this.supplier?.Preferred,
      })
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  supplierDetail(supplier: Supplier): void {
    this._router.navigate(['/suppliers', supplier.Id], {
      state: { navigationName: 'Back' },
    });
  }

  imageSelected($event): void {
    this.selectedImage = $event;
  }

  toggleColorLimit() {
    this.showingAllColors = !this.showingAllColors;
    this.visibleColors =
      this.visibleColors === ProductDetailComponent.DEFAULT_VISIBLE_COLORS
        ? this.product.Attributes?.Colors?.Values?.length
        : ProductDetailComponent.DEFAULT_VISIBLE_COLORS;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
  private scrollTop(): void {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  private captureProductAddedEvent(
    collectionId: number,
    productId: number,
    productsDuplicated: number[],
    productsTruncated: number[]
  ): void {
    const productCollectionAdd: TrackEvent<ProductCollectionTrackEvent> = {
      action: 'Collection Products Added',
      properties: {
        id: collectionId,
        products: [productId],
        productsDuplicated: productsDuplicated,
        productsTruncated: productsTruncated,
        source: { id: productId },
      },
    };
    this._analytics.track(productCollectionAdd);
  }
}

@NgModule({
  declarations: [ProductDetailComponent],
  imports: [
    CommonModule,

    FeatureFlagsModule,

    MatDialogModule,

    CosAccordionModule,
    CosAttributeTagModule,
    CosButtonModule,
    CosCardModule,
    CosProductMediaModule,
    CosProductVariantsModule,
    CosSupplierModule,

    ProductImprintMethodsComponentModule,
    ProductInfoComponentModule,
    ProductInventoryComponentModule,
    ProductMatrixComponentModule,
    ProductProductionShippingComponentModule,
    ProductSafetyWarningsComponentModule,
    ProductSpecialsComponentModule,

    FormatCPNPipeModule,
    FormatPriceRangePipeModule,
    Prop65PipeModule,
    ProductRelatedComponentModule,
    CosTrackEventModule,
  ],
  exports: [ProductDetailComponent],
})
export class ProductDetailComponentModule {}
