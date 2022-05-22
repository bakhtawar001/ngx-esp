import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AsiEmptyStateInfoModule } from '@asi/ui/feature-core';
import { CosButtonModule } from '@cosmos/components/button';
import { OrderType } from '@esp/models';
import { EspSearchPaginationModule, SEARCH_LOCAL_STATE } from '@esp/search';
import { OrderSearchLocalState } from '../../local-states';

@Component({
  selector: 'esp-order-search',
  templateUrl: './order-search.page.html',
  styleUrls: ['./order-search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    OrderSearchLocalState,
    { provide: SEARCH_LOCAL_STATE, useExisting: OrderSearchLocalState },
  ],
})
export class OrderSearchPage {
  constructor(
    public readonly state: OrderSearchLocalState,
    private readonly route: ActivatedRoute
  ) {
    state.connect(this);
  }

  createOrder(type: OrderType): void {
    this.state.createOrder(type, this.route.snapshot);
  }
}

@NgModule({
  declarations: [OrderSearchPage],
  imports: [
    CommonModule,
    RouterModule,
    CosButtonModule,
    EspSearchPaginationModule,
    AsiEmptyStateInfoModule,
  ],
})
export class OrderSearchPageModule {}
