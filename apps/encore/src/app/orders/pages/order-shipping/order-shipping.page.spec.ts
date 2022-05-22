import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { OrderDetailLocalState } from '../../local-states';
import {
  OrderShippingPage,
  OrderShippingPageModule,
} from './order-shipping.page';

describe('OrderShippingPage', () => {
  let spectator: Spectator<OrderShippingPage>;
  let component: OrderShippingPage;

  const createComponent = createComponentFactory({
    component: OrderShippingPage,
    imports: [OrderShippingPageModule, NgxsModule.forRoot()],
    providers: [OrderDetailLocalState],
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
