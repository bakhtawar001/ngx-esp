import { OrdersMockDb } from '@esp/__mocks__/orders';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  OrderLineItemProductHeaderComponent,
  OrderLineItemProductHeaderComponentModule,
} from './order-line-item-product-header.component';

describe('OrderLineItemProductHeaderComponent', () => {
  let spectator: Spectator<OrderLineItemProductHeaderComponent>;
  let component: OrderLineItemProductHeaderComponent;

  const lineItem = OrdersMockDb.lineItemProductDomainModel;

  const createComponent = createComponentFactory({
    component: OrderLineItemProductHeaderComponent,
    imports: [OrderLineItemProductHeaderComponentModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.setInput('lineItem', lineItem);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show product image', () => {
    const element = spectator.query(`img[url="${lineItem.ImageUrl}"]`);
    expect(element).toBeDefined();
  });

  it('should show product name', () => {
    const element = spectator.query('.line-item__name');
    expect(element).toHaveText(lineItem.Name);
  });

  it('should show product number', () => {
    const element = spectator.query('.line-item__number-cpn');
    expect(element).toHaveText(lineItem.Number);
  });

  it('should show the CPN #', () => {
    const element = spectator.query('.line-item__number-cpn');
    expect(element).toHaveText(lineItem.CPN);
  });

  it('should show the supplier component', () => {
    const element = spectator.query('cos-supplier');
    expect(element).toBeDefined();
    expect(element).toHaveText(lineItem.Supplier.Name);
  });
});
