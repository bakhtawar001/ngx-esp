import { OrdersMockDb } from '@esp/__mocks__/orders';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  OrderCustomerInfoComponent,
  OrderCustomerInfoComponentModule,
} from './order-customer-info.component';

describe('OrderCustomerInfoComponent', () => {
  let spectator: Spectator<OrderCustomerInfoComponent>;
  let component: OrderCustomerInfoComponent;

  const order = OrdersMockDb.orderDomainModel;

  const createComponent = createComponentFactory({
    component: OrderCustomerInfoComponent,
    imports: [OrderCustomerInfoComponentModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.setInput('order', order);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the primary order contact based on the order approver', () => {
    const name = spectator.query('.primary-contact__name h4');
    expect(name).toHaveText(order.AcknowledgementContact.Name);
  });

  it('should display the primary order contact company name', () => {
    const name = spectator.query('.primary-contact__company-name span');
    expect(name).toHaveText(order.AcknowledgementContact.CompanyName);
  });

  it('should display the primary order contact phone number', () => {
    const phone = spectator.query('.primary-contact__phone a');
    expect(phone).toHaveText(order.AcknowledgementContact.Address.Phone.Number);
  });

  it('should display the primary order contact email address', () => {
    const email = spectator.query('.primary-contact__email a');
    expect(email).toHaveText(order.AcknowledgementContact.EmailAddress);
  });
});
