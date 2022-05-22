import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosPresentationHeaderModule } from '@cosmos/components/presentation-header';
import { CosProductCardModule } from '@cosmos/components/product-card';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PresentationFooterComponentModule } from '../../../core/components/footer/presentation-footer.component';
import { PresentationDialogService } from '../../services';

@UntilDestroy()
@Component({
  selector: 'esp-presentation-cart',
  templateUrl: './presentation-cart.page.html',
  styleUrls: ['./presentation-cart.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationCartPage {
  constructor(
    private readonly _presentationDialogService: PresentationDialogService
  ) {}

  addToCart(id: number) {
    console.log('here');
    this._presentationDialogService
      .customizeProductDialog({
        productId: id,
      })
      .pipe(untilDestroyed(this))
      .subscribe((product) => {
        if (product) {
          console.log(product);
        }
      });
  }
}

@NgModule({
  declarations: [PresentationCartPage],
  imports: [
    CommonModule,
    RouterModule,

    CosPresentationHeaderModule,
    CosProductCardModule,
    CosCardModule,
    CosButtonModule,
    CosCheckboxModule,
    PresentationFooterComponentModule,

    MatDialogModule,
    MatNativeDateModule,
    NativeDateModule,
    MatDividerModule,
  ],
})
export class PresentationCartPageModule {}
