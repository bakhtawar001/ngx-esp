import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosProductCardModule } from '@cosmos/components/product-card';
import { CosSupplierModule } from '@cosmos/components/supplier';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-product-recos-card',
  templateUrl: './product-recos-card.component.html',
  styleUrls: ['./product-recos-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductRecommendationsCardComponent {
  @Input() products;
  @Input() category: 'trending' | 'discounted' = 'trending';
  @Input() viewMoreLink;
  @Input() categoryDesc;
}

@NgModule({
  declarations: [ProductRecommendationsCardComponent],
  imports: [
    CommonModule,

    CosCardModule,
    CosButtonModule,
    CosSupplierModule,
    CosProductCardModule,
  ],
  exports: [ProductRecommendationsCardComponent],
})
export class ProductRecommendationsCardModule {}
