import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosPillModule } from '@cosmos/components/pill';
import {
  CardMetadataListModule,
  SalesOrderCardModule,
} from '../../../core/components/cards';
import { OrderQuoteHeaderComponentModule } from '../../components/order-quote-header';
import { OrderDetailLocalState } from '../../local-states';

@Component({
  selector: 'esp-order-po',
  templateUrl: './order-po.page.html',
  styleUrls: ['./order-po.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPoPage {
  constructor(public readonly state: OrderDetailLocalState) {
    state.connect(this);
  }
}

@NgModule({
  declarations: [OrderPoPage],
  imports: [
    CommonModule,
    CosCardModule,
    CosButtonModule,
    CardMetadataListModule,
    MatMenuModule,
    CosAttributeTagModule,
    CosPillModule,
    SalesOrderCardModule,
    OrderQuoteHeaderComponentModule,
  ],
})
export class OrderPoPageModule {}
