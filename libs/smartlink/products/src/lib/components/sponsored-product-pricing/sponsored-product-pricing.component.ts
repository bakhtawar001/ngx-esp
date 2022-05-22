import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Price, Product } from '@smartlink/models';
import { FormatPricePipeModule } from '../../pipes';

@Component({
  selector: 'esp-sponsored-product-pricing',
  templateUrl: './sponsored-product-pricing.component.html',
  styleUrls: ['./sponsored-product-pricing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsoredProductPricingComponent implements OnChanges {
  @Input() product!: Product;
  @Input() label? = 'Price:';

  price: Price = {};

  ngOnChanges(changes: SimpleChanges): void {
    const currentProduct = changes.product?.currentValue;

    if (currentProduct) {
      if (currentProduct.Variants?.[0]?.Prices?.length) {
        this.price = currentProduct.Variants[0].Prices[0];
      } else if (currentProduct.HighestPrice) {
        this.price = currentProduct.HighestPrice;
      }
    }
  }
}

@NgModule({
  declarations: [SponsoredProductPricingComponent],
  imports: [CommonModule, FormatPricePipeModule],
  exports: [SponsoredProductPricingComponent],
})
export class SponsoredProductPricingComponentModule {}
