import { OrdersMockDb } from '@esp/__mocks__/orders';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  OrderQuoteInformationComponent,
  OrderQuoteInformationComponentModule,
} from './order-quote-information.component';

describe('OrderQuoteInformationComponent', () => {
  let spectator: Spectator<OrderQuoteInformationComponent>;
  let component: OrderQuoteInformationComponent;

  const quote = OrdersMockDb.quoteDomainModel;
  const order = OrdersMockDb.orderDomainModel;

  const createComponent = createComponentFactory({
    component: OrderQuoteInformationComponent,
    imports: [OrderQuoteInformationComponentModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.setInput('order', order);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /** Quote */

  it('should display a lock icon when Order is locked', () => {
    spectator.setInput('locked', true);
    const lockIcon = spectator.query('.order-info__lock-icon');
    const editBtn = spectator.query('.order-info__edit-btn');
    expect(lockIcon).toBeDefined();
    expect(editBtn).toBeNull();
  });

  it('should display an edit icon when Order is not locked', () => {
    spectator.setInput('locked', false);

    const editBtn = spectator.query('.order-info__edit-btn');
    const lockIcon = spectator.query('.order-info__lock-icon');
    expect(editBtn).toBeDefined();
    expect(lockIcon).toBeNull();
  });

  xit('should display the Quote Created date', () => {
    spectator.setInput('order', {
      ...quote,
      CreateDate: new Date('2021-12-08').toUTCString(),
    });
    const createDate = spectator.query('.order-info__create-date span');
    expect(createDate).toHaveText('December 8, 2021');
  });

  it('should display Order Contact', () => {
    const contact = spectator.query('.order-info__contact span');
    expect(contact).toHaveText(order.InquiryContact.Name);
  });

  xit('should display In-Hands Date', () => {
    spectator.setInput('order', {
      ...quote,
      InHandsDate: new Date('2021-12-05').toUTCString(),
    });
    const inHandsDate = spectator.query('.order-info__in-hands-date span');
    expect(inHandsDate).toHaveText('December 5, 2021');
  });

  xit('should display Ship Date', () => {
    spectator.setInput('order', {
      ...quote,
      ShipDate: new Date('2021-12-05').toUTCString(),
    });
    const inHandsDate = spectator.query('.order-info__ship-date span');
    expect(inHandsDate).toHaveText('December 5, 2021');
  });

  it('should not show Flexible or Firm indicator when not returned by the API', () => {
    spectator.setInput('order', {
      ...quote,
      IsInHandsDateFlexible: undefined,
    });

    const flexibleIndicator = spectator.query('.in-hands-date__flexible');
    const firmIndicator = spectator.query('.in-hands-date__firm');
    expect(flexibleIndicator).toBeNull();
    expect(firmIndicator).toBeNull();
  });

  it('should show Flexible indicator when has been selected', () => {
    spectator.setInput('order', {
      ...quote,
      IsInHandsDateFlexible: true,
    });

    const flexibleIndicator = spectator.query('.order-info__flexible');
    expect(flexibleIndicator).toBeDefined();
  });

  it('should show Firm indicator when has been selected', () => {
    spectator.setInput('order', {
      ...quote,
      IsInHandsDateFlexible: false,
    });

    const firmIndicator = spectator.query('.in-hands-date__firm');
    expect(firmIndicator).toBeDefined();
  });

  it('should show Blind indicator when IsBlindShip set to True', () => {
    spectator.setInput('order', {
      ...quote,
      IsBlindShip: true,
    });

    const blindShipIndicator = spectator.query('.order-info__blind-ship');
    expect(blindShipIndicator).toBeDefined();
  });

  it('should display Ship Via', () => {
    const element = spectator.query('.order-info__ship-via span');
    expect(element).toHaveText(order.ShippingDetail.CarrierName);
  });

  it('should display Shipping Account', () => {
    const element = spectator.query('.order-info__shipping-account span');
    expect(element).toHaveText(order.ShippingDetail.AccountNumber);
  });

  it('should display PO Reference ', () => {
    const element = spectator.query('.order-info__po-reference span');
    expect(element).toHaveText(order.POReference);
  });

  it('should display Terms', () => {
    const element = spectator.query('.order-info__terms span');
    expect(element).toHaveText(order.CreditTerm);
  });

  it('should display Currency', () => {
    const element = spectator.query('.order-info__currency span');
    expect(element).toHaveText(order.CurrencyCode);
  });

  /** Order */

  xit('should display the Order Created date', () => {
    spectator.setInput('order', {
      ...order,
      CreateDate: new Date('2021-12-08').toUTCString(),
    });
    const createDate = spectator.query('.order-info__create-date span');
    expect(createDate).toHaveText('December 8, 2021');
  });

  it('should not display the Order Expires date', () => {
    spectator.setInput('order', { ...order });
    const expiresDate = spectator.query('.order-info__expires-date');
    expect(expiresDate).toBeNull();
  });
});
