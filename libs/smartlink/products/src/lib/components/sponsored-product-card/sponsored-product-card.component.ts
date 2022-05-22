import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import {
  AttributeTag,
  CosProductCardTagsModule,
} from '@cosmos/components/product-card-tags';
import { Product } from '@smartlink/models';
import { ProductImageComponentModule } from '../product-image';
import { SponsoredProductPricingComponentModule } from '../sponsored-product-pricing';

@Component({
  selector: 'esp-sponsored-product-card',
  templateUrl: './sponsored-product-card.component.html',
  styleUrls: ['./sponsored-product-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsoredProductCardComponent implements OnChanges {
  @Input() product!: Product;
  @Output() productDetailClick = new EventEmitter<Product>();
  @Output() addToCollectionClick = new EventEmitter<Product>();

  tags: AttributeTag[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.product.currentValue) {
      this.setAttributeTags(changes.product.currentValue);
    }
  }

  private setAttributeTags(product: Product) {
    if (product.IsNew) {
      this.tags.push({
        Icon: 'exclamation-circle',
        Label: 'New',
      });
    }
  }
}

@NgModule({
  declarations: [SponsoredProductCardComponent],
  imports: [
    CommonModule,
    CosCardModule,
    CosProductCardTagsModule,
    ProductImageComponentModule,
    SponsoredProductPricingComponentModule,
    CosAttributeTagModule,
    CosButtonModule,
  ],
  exports: [SponsoredProductCardComponent],
})
export class SponsoredProductCardComponentModule {}
