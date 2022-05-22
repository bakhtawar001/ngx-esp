import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  OrderCustomerMessagesComponent,
  OrderCustomerMessagesComponentModule,
} from './order-customer-messages.component';

describe('OrderCustomerMessagesComponent', () => {
  let spectator: Spectator<OrderCustomerMessagesComponent>;
  let component: OrderCustomerMessagesComponent;

  const createComponent = createComponentFactory({
    component: OrderCustomerMessagesComponent,
    imports: [OrderCustomerMessagesComponentModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
