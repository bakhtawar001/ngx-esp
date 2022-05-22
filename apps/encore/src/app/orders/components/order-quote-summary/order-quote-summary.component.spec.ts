import { CommonModule } from '@angular/common';
import { OrderDomainModel } from '@esp/models';
import { OrdersMockDb } from '@esp/__mocks__/orders';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { OrderPercentPipe, OrderPricePipe } from '../../pipes';
import {
  OrderQuoteSummaryComponent,
  OrderQuoteSummaryComponentModule,
} from './order-quote-summary.component';

describe('OrderQuoteSummaryComponent', () => {
  let spectator: Spectator<OrderQuoteSummaryComponent>;
  let component: OrderQuoteSummaryComponent;

  let currencyPipe: OrderPricePipe;
  let percentPipe: OrderPercentPipe;

  const quote = OrdersMockDb.quoteDomainModel;
  const order: OrderDomainModel = {
    ...quote,
    Type: 'order',
  };

  const createComponent = createComponentFactory({
    component: OrderQuoteSummaryComponent,
    imports: [CommonModule, OrderQuoteSummaryComponentModule],
    providers: [OrderPricePipe, OrderPercentPipe],
  });

  function getInnerHtml(selector: string) {
    return spectator.query(selector).innerHTML.trim();
  }

  function getPriceString(value: number, float = 2) {
    return currencyPipe.transform(value, order, float);
  }

  function getPercentageString(value: number) {
    return percentPipe.transform(value / 100);
  }

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.setInput('order', quote);

    currencyPipe = spectator.inject(OrderPricePipe, true);
    percentPipe = spectator.inject(OrderPercentPipe, true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /** Common Quote/Order  */

  it('should display Vendor Cost', () => {
    const value = getPriceString(quote.TotalCost);
    const vendorCost = getInnerHtml('.order-quote-summary__vendor-cost h4');
    expect(vendorCost).toBe(value);
  });

  it('should display Sales Tax as currency value with 2 decimal places', () => {
    const value = getPriceString(quote.TotalSalesTaxAmount);
    const salesTax = getInnerHtml('.order-quote-summary__sales-tax h4');
    expect(salesTax).toBe(value);
  });

  it('should display Margin value as currency value with 2 decimal places', () => {
    const value = getPriceString(quote.TotalMargin);
    const salesTax = getInnerHtml('.order-quote-summary__margin h4');
    expect(salesTax).toContain(value);
  });

  it('should display next to Margin value the percentage of margin', () => {
    const value = `(${getPercentageString(order.TotalMarginPercent)})`;
    const salesTax = getInnerHtml('.order-quote-summary__margin h4');
    expect(salesTax).toContain(value);
  });

  it('should display Customer Price as currency value with 2 decimal places', () => {
    const value = getPriceString(quote.Subtotal);
    const salesTax = getInnerHtml('.order-quote-summary__customer-price h4');
    expect(salesTax).toContain(value);
  });

  it('should display Customer Discounts as currency value with 2 decimal places', () => {
    const value = getPriceString(quote.TotalDiscountAmount);
    const salesTax = getInnerHtml(
      '.order-quote-summary__customer-discounts h4'
    );
    expect(salesTax).toContain(value);
  });

  it('should display Balance Due as currency value with 2 decimal places', () => {
    spectator.setInput('order', order);
    const value = getPriceString(order.AmountDue);
    const salesTax = getInnerHtml('.order-quote-summary__balance-due h4');
    expect(salesTax).toContain(value);
  });

  /** Order */

  it('should display Amount Paid as currency value with 2 decimal places', () => {
    spectator.setInput('order', order);
    const value = getPriceString(order.AmountPaid);
    const salesTax = getInnerHtml('.order-quote-summary__amount-paid h4');
    expect(salesTax).toContain(value);
  });
});
