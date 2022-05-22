import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosAccordionModule } from '@cosmos/components/accordion';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { OrderDecorationItemDetailsComponentModule } from '../order-decoration-item-details';
import { OrderDecorationItemInfoComponentModule } from '../order-decoration-item-info';
import { OrderDecorationItemProductComponentModule } from '../order-decoration-item-product';

@Component({
  selector: 'esp-order-decoration-item',
  templateUrl: './order-decoration-item.component.html',
  styleUrls: ['./order-decoration-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDecorationItemComponent {}

@NgModule({
  declarations: [OrderDecorationItemComponent],
  imports: [
    CommonModule,
    CosCardModule,
    MatMenuModule,
    CosAccordionModule,
    CosButtonModule,
    CosAttributeTagModule,
    OrderDecorationItemDetailsComponentModule,
    OrderDecorationItemProductComponentModule,
    OrderDecorationItemInfoComponentModule,
  ],
  exports: [OrderDecorationItemComponent],
})
export class OrderDecorationItemComponentModule {}
