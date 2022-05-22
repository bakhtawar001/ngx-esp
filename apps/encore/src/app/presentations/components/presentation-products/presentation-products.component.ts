import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { CosProductCardModule } from '@cosmos/components/product-card';
import { FeatureFlagsModule } from '@cosmos/feature-flags';
import { FormControl } from '@cosmos/forms';
import { PresentationProduct, PresentationProductSortOrder } from '@esp/models';
import {
  PresentationProductActions,
  PresentationsActions,
} from '@esp/presentations';
import { EspSearchSortModule } from '@esp/search';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductGalleryComponentModule } from '../../../products/components/product-gallery';
import { productSortOptions } from '../../configs';
import { PresentationLocalState } from '../../local-states';
import { MOCK_PRODUCT } from '../../mock_data/product_data.mock';
import { PresNoProductsMessageModule } from '../../pages/presentation-settings/components/empty_state/NoProductsMessage/NoProductsMessage.component';
import { mapPresentationProduct } from '../../utils';

@UntilDestroy()
@Component({
  selector: 'esp-presentation-products',
  templateUrl: './presentation-products.component.html',
  styleUrls: ['./presentation-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PresentationLocalState],
})
export class PresentationProductsComponent {
  state$ = this.state.connect(this);

  // TODO: get state of presentatio for view and get recommended products
  presentationPhase = new FormControl('quote_requested');
  recommendedProducts = Array(4).fill(MOCK_PRODUCT);

  mapProduct = mapPresentationProduct;
  sortMenuOptions = productSortOptions;
  sort = new FormControl('None');

  constructor(
    private readonly store: Store,
    public readonly state: PresentationLocalState
  ) {
    this.sort.valueChanges
      .pipe(debounceTime(100), distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value: PresentationProductSortOrder) => {
        if (value !== 'None') {
          this.sortProducts(value);
        }
        this.sort.setValue('None');
      });
  }

  sequenceProducts(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.state.visibleProducts,
      event.previousIndex,
      event.currentIndex
    );

    const sequence = this.state.visibleProducts.map((product, i) => ({
      ...product,
      Sequence: i,
    }));

    this.store.dispatch(
      new PresentationsActions.SequenceProducts(
        this.state.presentation.Id,
        sequence
      )
    );
  }

  sortProducts(sortOrder: PresentationProductSortOrder) {
    this.store.dispatch(
      new PresentationsActions.SortProducts(
        this.state.presentation.Id,
        sortOrder
      )
    );
  }

  saveVisibility(product: PresentationProduct) {
    this.store.dispatch(
      new PresentationProductActions.SaveVisibility(
        product.Id,
        !product.IsVisible
      )
    );
  }

  removeProduct(product: PresentationProduct) {
    this.store.dispatch(
      new PresentationsActions.RemoveProduct(
        this.state.presentation.Id,
        product.Id
      )
    );
  }
}

@NgModule({
  declarations: [PresentationProductsComponent],
  imports: [
    CommonModule,
    RouterModule,
    DragDropModule,
    ReactiveFormsModule,

    FeatureFlagsModule,

    MatTabsModule,
    MatMenuModule,

    CosButtonModule,
    CosFormFieldModule,
    CosInputModule,
    CosProductCardModule,

    EspSearchSortModule,
    PresNoProductsMessageModule,
    ProductGalleryComponentModule,
  ],
  exports: [PresentationProductsComponent],
})
export class PresentationProductsComponentModule {}
