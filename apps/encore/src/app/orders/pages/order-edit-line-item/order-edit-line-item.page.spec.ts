import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EspOrdersModule, OrdersService } from '@esp/orders';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  OrderEditLineItemPage,
  OrderEditLineItemPageModule,
} from './order-edit-line-item.page';

describe('OrderDetailPage', () => {
  let spectator: Spectator<OrderEditLineItemPage>;
  let component: OrderEditLineItemPage;

  const createComponent = createComponentFactory({
    component: OrderEditLineItemPage,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule.withRoutes([
        {
          path: 'orders/:id',
          component: OrderEditLineItemPage,
        },
      ]),

      NgxsModule.forRoot(),
      EspOrdersModule,

      OrderEditLineItemPageModule,
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
