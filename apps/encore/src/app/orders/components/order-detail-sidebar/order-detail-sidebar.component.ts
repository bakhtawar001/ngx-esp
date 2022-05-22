import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosPillModule } from '@cosmos/components/pill';
import { CosVerticalMenuModule } from '@cosmos/components/vertical-menu';
import { NavigationItem } from '@cosmos/layout/navigation';
import { OrderDomainModel } from '@esp/models';
import { OrderDetailMenu } from '../../configs/menu.config';
import { OrderQuoteSummaryComponentModule } from '../order-quote-summary';

@Component({
  selector: 'esp-order-detail-sidebar',
  templateUrl: './order-detail-sidebar.component.html',
  styleUrls: ['./order-detail-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailSidebarComponent {
  @Input() order: OrderDomainModel;
  menu: NavigationItem[] = OrderDetailMenu;
}

@NgModule({
  declarations: [OrderDetailSidebarComponent],
  imports: [
    CommonModule,
    LayoutModule,
    CosButtonModule,
    CosVerticalMenuModule,
    CosPillModule,
    OrderQuoteSummaryComponentModule,
  ],
  exports: [OrderDetailSidebarComponent],
})
export class OrderDetailSidebarComponentModule {}
