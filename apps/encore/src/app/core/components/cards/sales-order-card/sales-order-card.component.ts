import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosPillModule } from '@cosmos/components/pill';
import { CardMetadataListModule } from '../card-metadata-list';

@Component({
  selector: 'esp-sales-order-card',
  templateUrl: './sales-order-card.component.html',
  styleUrls: ['./sales-order-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesOrderCardComponent {
  @Input() orderClosed: boolean;
}

@NgModule({
  declarations: [SalesOrderCardComponent],
  imports: [
    CommonModule,
    CosCardModule,
    CosButtonModule,
    CosPillModule,
    CardMetadataListModule,
  ],
  exports: [SalesOrderCardComponent],
})
export class SalesOrderCardModule {}
