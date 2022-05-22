import { CommonModule } from '@angular/common';
import { ServiceLineItemDomainModel } from '@esp/models';
import { OrdersMockDb } from '@esp/__mocks__/orders';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { OrderPercentPipe, OrderPricePipe } from '../../pipes';
import {
  OrderLineItemServiceHeaderComponent,
  OrderLineItemServiceHeaderComponentModule,
} from './order-line-item-service-header.component';

describe('OrderLineItemServiceHeaderComponent', () => {
  let spectator: Spectator<OrderLineItemServiceHeaderComponent>;
  let component: OrderLineItemServiceHeaderComponent;

  let currencyPipe: OrderPricePipe;
  let percentPipe: OrderPercentPipe;

  const lineItem =
    OrdersMockDb.lineItemProductDomainModel as unknown as ServiceLineItemDomainModel;

  const createComponent = createComponentFactory({
    component: OrderLineItemServiceHeaderComponent,
    imports: [CommonModule, OrderLineItemServiceHeaderComponentModule],
    providers: [OrderPricePipe, OrderPercentPipe],
  });

  function getColumn(column: string) {
    return spectator.query(`.line-item__charges tbody .cos-column-${column}`);
  }

  function getColumnHeader(column: string) {
    return spectator.query(`.line-item__charges thead .cos-column-${column}`);
  }

  function getColumnFooter(column: string) {
    return spectator.query(`.line-item__charges tfoot .cos-column-${column}`);
  }

  function hasFormattedPrice(value: number, column: Element, float = 4) {
    const formattedValue = currencyPipe.transform(value, lineItem, float);
    expect(column).toHaveText(formattedValue);
  }

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.setInput('lineItem', lineItem);

    currencyPipe = spectator.inject(OrderPricePipe, true);
    percentPipe = spectator.inject(OrderPercentPipe, true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show columns per prototype: Item, Quantity, Net Cost, Margin, Price, Total Cost, Total Price, Tax', () => {
    function columnExists(column: string, text: string) {
      const element = getColumnHeader(column);
      expect(element).toBeDefined();
      expect(element).toHaveText(text);
    }

    columnExists('item', 'Item');
    columnExists('quantity', 'Quantity');
    columnExists('netCost', 'Net Cost');
    columnExists('margin', 'Margin');
    columnExists('price', 'Price');
    columnExists('totalCost', 'Total Cost');
    columnExists('totalPrice', 'Total Price');
    columnExists('tax', 'Tax');
  });

  it('should get the item description from LineItems.Description', () => {
    const element = getColumn('item');
    expect(element).toHaveText(lineItem.Description);
  });

  it('should get quantity based on LineItems.Quantity', () => {
    const element = getColumn('quantity');
    expect(element).toHaveText(lineItem.Quantity.toString());
    expect(element).toHaveClass('text-right');
  });

  it('should get Net Cost based on LineItems.Cost', () => {
    lineItem.Cost = 23.082204;
    spectator.setInput('lineItem', lineItem);

    const element = getColumn('netCost');
    hasFormattedPrice(lineItem.Cost, element);
    expect(element).toHaveClass('text-right');
  });

  it('should get Margin based on a calculation', () => {
    const element = getColumn('margin');
    const value = percentPipe.transform(lineItem.Totals.Margin / 100);
    expect(element).toHaveText(value);
    expect(element).toHaveClass('text-right');
  });

  it('should get Price based on LineItems.Price', () => {
    const element = getColumn('price');
    hasFormattedPrice(lineItem.Price, element);
    expect(element).toHaveClass('text-right');
  });

  it('should get Total Cost based on LineItems.Totals.Cost', () => {
    const element = getColumn('totalCost');
    hasFormattedPrice(lineItem.Totals.Cost, element);
    expect(element).toHaveClass('text-right');
  });

  it('should get Total Price based on LineItems.Totals.Amount', () => {
    const element = getColumn('totalPrice');
    hasFormattedPrice(lineItem.Totals.Amount, element);
    expect(element).toHaveClass('text-right');
  });

  it('should show Tax as a checkbox control and set to checked when LineItems.IsTaxable = True', () => {
    lineItem.IsTaxable = true;
    spectator.setInput('lineItem', lineItem);

    const element = getColumn('tax');
    const checkbox = element.querySelector('cos-checkbox');
    expect(checkbox).toBeDefined();
    expect(checkbox).toHaveClass('cos-checkbox-checked');
  });

  it('should show in a disabled state when LineItems.Totals.TaxRate is 0% for this product line', () => {
    lineItem.Totals.TaxRate = 0;
    spectator.setInput('lineItem', lineItem);

    const element = getColumn('tax');
    const checkbox = element.querySelector('cos-checkbox');
    expect(checkbox).toBeDefined();
    expect(checkbox).toHaveClass('cos-checkbox-disabled');
  });

  it('should show a Total (currency code) line', () => {
    const totalRow = spectator.query('.line-item__total-row');
    const totalCol = getColumnFooter('item');
    expect(totalRow).toBeDefined();
    expect(totalCol).toHaveText(`Total (${lineItem.CurrencyCode})`);
  });

  it('should get Total Cost from LineItems.Totals.Cost', () => {
    const element = getColumnFooter('totalCost');
    hasFormattedPrice(lineItem.Totals.Cost, element, 2);
    expect(element).toHaveClass('text-right');
  });

  it('should get Total Price from LineItems.Totals.Amount', () => {
    const element = getColumnFooter('totalPrice');
    hasFormattedPrice(lineItem.Totals.Amount, element);
    expect(element).toHaveClass('text-right');
  });
});
