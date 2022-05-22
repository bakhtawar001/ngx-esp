import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { ProductLineItemDomainModel } from '@esp/models';
import { UntilDestroy } from '@ngneat/until-destroy';
import { EditLineItemProductDetailsComponentModule } from '../../components/edit-line-item-product-details';
import { EditLineItemProductHeroComponentModule } from '../../components/edit-line-item-product-hero';
import { EditLineItemVariantsComponentModule } from '../../components/edit-line-item-variants';
import { EditLineItemLocalState } from '../../local-states';

@UntilDestroy()
@Component({
  selector: 'esp-order-edit-line-item',
  templateUrl: './order-edit-line-item.page.html',
  styleUrls: ['./order-edit-line-item.page.scss'],
  providers: [EditLineItemLocalState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderEditLineItemPage {
  constructor(public readonly state: EditLineItemLocalState) {
    state.connect(this);
  }

  get product(): ProductLineItemDomainModel {
    // TODO: distinguish all types
    return this.state.lineItem as any;
  }
}

@NgModule({
  declarations: [OrderEditLineItemPage],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatMenuModule,
    CosButtonModule,
    CosCardModule,
    EditLineItemProductHeroComponentModule,
    EditLineItemProductDetailsComponentModule,
    EditLineItemVariantsComponentModule,
  ],
})
export class OrderEditLineItemPageModule {}
