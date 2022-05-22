import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { CosCardModule } from '@cosmos/components/card';
import { CosSupplierModule } from '@cosmos/components/supplier';
import { ProductLineItemDomainModel } from '@esp/models';
import { PresentationProductImageComponentModule } from '../../../presentations/components';

@Component({
  selector: 'esp-edit-line-item-product-hero',
  templateUrl: './edit-line-item-product-hero.component.html',
  styleUrls: ['./edit-line-item-product-hero.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditLineItemProductHeroComponent {
  @Input() lineItem: ProductLineItemDomainModel;
}

@NgModule({
  imports: [
    CommonModule,
    CosCardModule,
    CosSupplierModule,
    PresentationProductImageComponentModule,
  ],
  declarations: [EditLineItemProductHeroComponent],
  exports: [EditLineItemProductHeroComponent],
})
export class EditLineItemProductHeroComponentModule {}
