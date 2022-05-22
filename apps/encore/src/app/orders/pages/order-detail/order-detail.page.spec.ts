import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EspOrdersModule, OrdersService } from '@esp/orders';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { OrderDetailPage, OrderDetailPageModule } from './order-detail.page';

describe('OrderDetailPage', () => {
  let spectator: Spectator<OrderDetailPage>;
  let component: OrderDetailPage;

  const createComponent = createComponentFactory({
    component: OrderDetailPage,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule.withRoutes([
        {
          path: 'orders/:id',
          component: OrderDetailPage,
        },
      ]),

      NgxsModule.forRoot(),
      EspOrdersModule,

      OrderDetailPageModule,
    ],
    providers: [mockProvider(OrdersService, {})],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
