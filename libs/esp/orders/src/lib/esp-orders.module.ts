import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import {
  CurrentOrderState,
  OrderLineItemsState,
  OrderProductState,
  OrdersSearchState,
} from './states';

@NgModule({
  imports: [
    NgxsModule.forFeature([
      CurrentOrderState,
      OrderLineItemsState,
      OrderProductState,
      OrdersSearchState,
    ]),
  ],
})
export class EspOrdersModule {}
