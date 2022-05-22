import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  OrderStatusComponent,
  OrderStatusComponentModule,
} from './order-status.component';

describe('OrderStatusComponent', () => {
  let spectator: Spectator<OrderStatusComponent>;
  let component: OrderStatusComponent;

  const createComponent = createComponentFactory({
    component: OrderStatusComponent,
    imports: [OrderStatusComponentModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
