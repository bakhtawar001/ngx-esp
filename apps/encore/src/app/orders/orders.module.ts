import { NgModule } from '@angular/core';
import { EspOrdersModule } from '@esp/orders';
import { OrdersRoutingModule } from './orders-routing.module';

@NgModule({
  imports: [EspOrdersModule, OrdersRoutingModule],
})
export class OrdersModule {}
