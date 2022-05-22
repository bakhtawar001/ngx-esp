import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosRatingModule } from '@cosmos/components/rating';
import { FeatureFlagsModule } from '@cosmos/feature-flags';
import { CosRatingsReviewsComponent } from './ratings-reviews.component';

@NgModule({
  imports: [
    CommonModule,

    FeatureFlagsModule,

    MatDividerModule,
    CosButtonModule,
    CosRatingModule,
    CosCardModule,
  ],
  exports: [CosRatingsReviewsComponent],
  declarations: [CosRatingsReviewsComponent],
})
export class CosRatingsReviewsModule {}
