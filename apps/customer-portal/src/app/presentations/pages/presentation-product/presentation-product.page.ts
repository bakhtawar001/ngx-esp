import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { CosNotificationModule } from '@cosmos/components/notification';
import { CosProductMediaModule } from '@cosmos/components/product-media';
import { CosProductVariantsModule } from '@cosmos/components/product-variant-details';
import { CosTableModule } from '@cosmos/components/table';
import { UntilDestroy } from '@ngneat/until-destroy';
import { PresentationFooterComponentModule } from '../../../core/components/footer/presentation-footer.component';
import { MOCK_COS_MEDIA_PRODUCT } from '../../mock_data/cos_media_product.mock';
import { MOCK_PRODUCT } from '../../mock_data/product_data.mock';

@UntilDestroy()
@Component({
  selector: 'esp-presentation-product-page',
  templateUrl: './presentation-product.page.html',
  styleUrls: ['./presentation-product.page.scss'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationProductPage {
  //-------------------------------------------------------------------------------------------------------------------
  // @Private Accessors
  //---------------------------------------------------------------------------------------------------------------------

  product: any = MOCK_PRODUCT;

  cosMediaProduct: any = MOCK_COS_MEDIA_PRODUCT;

  get productVariants() {
    return {
      options: this.product.Variant,
    };
  }

  constructor(private readonly _router: Router) {}

  goBack() {
    this._router.navigate(['./']);
  }

  downvote() {
    alert('Downvote');
  }

  addToCart() {
    alert('Add To Cart');
  }
}

@NgModule({
  declarations: [PresentationProductPage],
  imports: [
    CommonModule,
    PresentationFooterComponentModule,
    CosProductMediaModule,
    CosNotificationModule,
    CosButtonModule,
    CosTableModule,
    CosProductVariantsModule,
    MatDividerModule,
  ],
})
export class PresentationProductPageModule {}
