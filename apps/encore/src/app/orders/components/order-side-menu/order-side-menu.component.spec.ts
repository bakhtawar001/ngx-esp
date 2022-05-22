import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  OrderSideMenuComponent,
  OrderSideMenuComponentModule,
} from './order-side-menu.component';

describe('OrderSideMenuComponent', () => {
  let spectator: Spectator<OrderSideMenuComponent>;
  let component: OrderSideMenuComponent;

  const createComponent = createComponentFactory({
    component: OrderSideMenuComponent,
    imports: [OrderSideMenuComponentModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
