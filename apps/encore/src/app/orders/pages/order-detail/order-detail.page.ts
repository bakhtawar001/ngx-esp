import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit,
  Type,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import {
  ActivatedRoute,
  Data,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { trackItem } from '@cosmos/core';
import { OrderLineItemDomainModel } from '@esp/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { OrderDetailSidebarComponentModule } from '../../components/order-detail-sidebar';
import { OrderDetailTitleModule } from '../../components/order-detail-title';
import { OrderLineItemComponentModule } from '../../components/order-line-item';
import { OrderQuoteSummaryComponentModule } from '../../components/order-quote-summary';
import { OrderSideMenuComponentModule } from '../../components/order-side-menu';
import { OrderStatusComponentModule } from '../../components/order-status';
import { CurrentOrderGuard } from '../../guards';
import { OrderDetailLocalState } from '../../local-states';
import { LoadOrdersResolver } from '../../resolvers';

@UntilDestroy()
@Component({
  selector: 'esp-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
  providers: [OrderDetailLocalState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailPage implements OnInit {
  componentWithActions: Type<unknown>;
  trackOrderLineItem = trackItem<OrderLineItemDomainModel>(['Id']);

  constructor(
    public readonly state: OrderDetailLocalState,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    state.connect(this);
  }

  ngOnInit(): void {
    this.componentWithActions = this.getComponentFromRouteData(
      this._activatedRoute.snapshot.firstChild.data
    );

    this._router.events.pipe(untilDestroyed(this)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.componentWithActions = this.getComponentFromRouteData(
          this._activatedRoute.snapshot.firstChild.data
        );
      }
    });
  }

  private getComponentFromRouteData(routeData: Data) {
    if (typeof routeData.actions === 'function') {
      return routeData.actions();
    } else {
      return null;
    }
  }
}

@NgModule({
  declarations: [OrderDetailPage],
  imports: [
    CommonModule,
    RouterModule,

    MatMenuModule,
    CosButtonModule,

    OrderStatusComponentModule,
    OrderQuoteSummaryComponentModule,
    OrderSideMenuComponentModule,
    OrderLineItemComponentModule,
    OrderDetailSidebarComponentModule,
    OrderDetailTitleModule,
  ],
  providers: [CurrentOrderGuard, LoadOrdersResolver],
})
export class OrderDetailPageModule {}
