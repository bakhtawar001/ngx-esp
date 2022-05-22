import { OrdersMockDb } from '@esp/__mocks__/orders';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  OrderCustomerAddressComponent,
  OrderCustomerAddressComponentModule,
} from './order-customer-address.component';

describe('OrderCustomerAddressComponent', () => {
  let spectator: Spectator<OrderCustomerAddressComponent>;
  let component: OrderCustomerAddressComponent;

  const order = OrdersMockDb.orderDomainModel;
  const contact = order.ShippingContact;

  const createComponent = createComponentFactory({
    component: OrderCustomerAddressComponent,
    imports: [OrderCustomerAddressComponentModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.setInput('contact', contact);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the contact name', () => {
    const address = spectator.query('address');
    expect(address).toHaveText(contact.Name);
  });

  it('should display the contact address information Line1, Line2, City, State, Zip, Country', () => {
    const address = spectator.query('address');
    expect(address).toHaveText(contact.Address.Line1);
    expect(address).toHaveText(contact.Address.Line2);
    expect(address).toHaveText(contact.Address.City);
    expect(address).toHaveText(contact.Address.State);
    expect(address).toHaveText(contact.Address.PostalCode);
    expect(address).toHaveText(contact.Address.Country);
  });

  it('should only display for available values and close up the address information when data is not found', () => {
    spectator.setInput('contact', null);
    const address = spectator.query('address');
    expect(address).not.toBeTruthy();
  });

  it('should not show the comma as part of the city, state if there is no city value', () => {
    const contactWithoutCity = {
      ...contact,
      Address: {
        ...contact.Address,
        City: undefined,
      },
    };

    spectator.setInput('contact', contactWithoutCity);
    const address = spectator.query('.customer-address__city');
    expect(address).not.toBeTruthy();
  });

  it('should display the contact phone number', () => {
    const address = spectator.query('address');
    expect(address).toHaveText(contact.Address.Phone.Number);
  });

  it('should display the contact email address', () => {
    const address = spectator.query('address');
    expect(address).toHaveText(contact.EmailAddress);
  });
});
