import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  NgModule,
  Type,
  ViewEncapsulation,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { trackItem } from '@cosmos/core';
import { Order } from '@esp/models';
import { OrderDetailLocalState } from '../../local-states';
import { OrderLinkPipeModule } from './order-link.pipe';

@Component({
  selector: 'esp-order-detail-title',
  templateUrl: './order-detail-title.component.html',
  styleUrls: ['./order-detail-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OrderDetailTitleComponent {
  @Input() componentWithActions: Type<unknown>;

  @HostBinding('class')
  hostClass = 'proj-orders__pg-title flex justify-between';

  constructor(
    public readonly state: OrderDetailLocalState,
    public readonly route: ActivatedRoute
  ) {
    state.connect(this);
  }

  trackByFn = trackItem<Order>(['Id']);

  isActive(id: number) {
    return this.state.orderViewModel.Id === id;
  }
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    CosButtonModule,
    OrderLinkPipeModule,
  ],
  declarations: [OrderDetailTitleComponent],
  exports: [OrderDetailTitleComponent],
})
export class OrderDetailTitleModule {}
