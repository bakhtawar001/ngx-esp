import { CommonModule } from '@angular/common';
import { OrdersMockDb } from '@esp/__mocks__/orders';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { OrderPercentPipe, OrderPricePipe } from '../../pipes';
import {
  OrderLineItemVariantsListComponent,
  OrderLineItemVariantsListComponentModule,
} from './order-line-item-variants-list.component';
import { VariantsGridDataSourcePipe } from './variants-grid-data-source.pipe';

describe('OrderLineItemVariantsListComponent', () => {
  let spectator: Spectator<OrderLineItemVariantsListComponent>;
  let component: OrderLineItemVariantsListComponent;

  let currencyPipe: OrderPricePipe;
  let percentPipe: OrderPercentPipe;
  let variantsGridDataSourcePipe: VariantsGridDataSourcePipe;

  const lineItem = OrdersMockDb.lineItemProductDomainModel;

  const createComponent = createComponentFactory({
    component: OrderLineItemVariantsListComponent,
    imports: [CommonModule, OrderLineItemVariantsListComponentModule],
    providers: [OrderPricePipe, OrderPercentPipe, VariantsGridDataSourcePipe],
  });

  function getColumn(column: string, row = 'variant-row') {
    return spectator.query(
      `.line-item__variants tbody .${row} .cos-column-${column}`
    );
  }

  function getColumnHeader(column: string) {
    return spectator.query(`.line-item__variants thead .cos-column-${column}`);
  }

  function getColumnFooter(column: string) {
    return spectator.query(`.line-item__variants tfoot .cos-column-${column}`);
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
    variantsGridDataSourcePipe = spectator.inject(VariantsGridDataSourcePipe);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Variants list
   */

  it('should show a separate row for each specific line item record for each variant(s) record', () => {
    const elements = spectator.queryAll('.line-item__variants tbody tr');
    const dataSource = variantsGridDataSourcePipe.transform(
      spectator.component.lineItem
    );
    expect(elements.length).toBe(dataSource.length);
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

  it('should get the item description from LineItems.Variants.Description', () => {
    const element = getColumn('item');
    expect(element).toHaveText(lineItem.Variants[0].Description);
  });

  it('should get quantity based on LineItems.Variants.Quantity', () => {
    const element = getColumn('quantity');
    expect(element).toHaveText(lineItem.Variants[0].Quantity.toString());
    expect(element).toHaveClass('text-right');
  });

  it('should get Net Cost based on LineItems.Variants.Cost', () => {
    lineItem.Variants[0].Cost = 23.082204;
    spectator.setInput('lineItem', lineItem);

    const element = getColumn('netCost');
    hasFormattedPrice(lineItem.Variants[0].Cost, element);
    expect(element).toHaveClass('text-right');
  });

  it('should get Margin based on a calculation', () => {
    const element = getColumn('margin');
    const value = percentPipe.transform(
      lineItem.Variants[0].MarginPercent / 100
    );
    expect(element).toHaveText(value);
    expect(element).toHaveClass('text-right');
  });

  it('should get Price based on LineItems.Variants.Price', () => {
    const element = getColumn('price');
    hasFormattedPrice(lineItem.Variants[0].Price, element);
    expect(element).toHaveClass('text-right');
  });

  it('should get Total Cost based on LineItems.Variants.Totals.Cost', () => {
    const element = getColumn('totalCost');
    hasFormattedPrice(lineItem.Variants[0].Totals.Cost, element);
    expect(element).toHaveClass('text-right');
  });

  it('should get Total Price based on LineItems.Variants.Totals.Amount', () => {
    const element = getColumn('totalPrice');
    hasFormattedPrice(lineItem.Variants[0].Totals.Amount, element);
    expect(element).toHaveClass('text-right');
  });

  it('should show Tax as a checkbox control and set to checked when LineItems.IsTaxable = True', () => {
    lineItem.Variants[0].IsTaxable = true;
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

  /**
   * Quantity total unit
   */

  it('should show a break in the grid of records to show Total Unit for Quantity', () => {
    const elementHeader = getColumn('item', 'total-units-row');
    expect(elementHeader).toHaveText('Total Units');

    const element = getColumn('quantity', 'total-units-row');
    expect(element).toHaveText(lineItem.Totals.Units.toString());
    expect(element).toHaveClass('text-right');
  });

  /**
   * Service Charges list
   */

  it('should get the item description from LineItems.ServiceCharges.Description', () => {
    const element = getColumn('item', 'service-charge-row');
    expect(element).toHaveText(lineItem.ServiceCharges[0].Description);
  });

  it('should show treatment per prototype (blue font, checkbox and label "Included in customer total")', () => {
    const element = getColumn('item', 'service-charge-row');
    expect(element).toHaveDescendant('.cos-attribute-tag');
    expect(element).toHaveDescendant('.fa-check');
    expect(element).toHaveText('Included in customer total');
  });

  it('should get quantity based on LineItems.ServiceCharges.Quantity', () => {
    const element = getColumn('quantity', 'service-charge-row');
    expect(element).toHaveText(lineItem.ServiceCharges[0].Quantity.toString());
    expect(element).toHaveClass('text-right');
  });

  it('should get Net Cost based on LineItems.ServiceCharges.Cost', () => {
    lineItem.ServiceCharges[0].Cost = 23.082204;
    spectator.setInput('lineItem', lineItem);

    const element = getColumn('netCost', 'service-charge-row');
    hasFormattedPrice(lineItem.ServiceCharges[0].Cost, element);
    expect(element).toHaveClass('text-right');
  });

  it('should get Margin based on a calculation', () => {
    const element = getColumn('margin', 'service-charge-row');
    const value = percentPipe.transform(
      lineItem.ServiceCharges[0].MarginPercent / 100
    );
    expect(element).toHaveText(value);
    expect(element).toHaveClass('text-right');
  });

  it('should get Price based on LineItems.ServiceCharges.Price', () => {
    const element = getColumn('price', 'service-charge-row');
    hasFormattedPrice(lineItem.ServiceCharges[0].Price, element);
    expect(element).toHaveClass('text-right');
  });

  it('should get Total Cost based on LineItems.ServiceCharges.Totals.Cost', () => {
    const element = getColumn('totalCost', 'service-charge-row');
    hasFormattedPrice(lineItem.ServiceCharges[0].Totals.Cost, element);
    expect(element).toHaveClass('text-right');
  });

  it('should get Total Price based on LineItems.ServiceCharges.Totals.Amount', () => {
    const element = getColumn('totalPrice', 'service-charge-row');
    hasFormattedPrice(lineItem.ServiceCharges[0].Totals.Amount, element);
    expect(element).toHaveClass('text-right');
  });

  it('should show Tax as a checkbox control and set to checked when LineItems.IsTaxable = True', () => {
    lineItem.ServiceCharges[0].IsTaxable = true;
    spectator.setInput('lineItem', lineItem);

    const element = getColumn('tax', 'service-charge-row');
    const checkbox = element.querySelector('cos-checkbox');
    expect(checkbox).toBeDefined();
    expect(checkbox).toHaveClass('cos-checkbox-checked');
  });

  it('should show in a disabled state when LineItems.Totals.TaxRate is 0% for this product line', () => {
    lineItem.Totals.TaxRate = 0;
    spectator.setInput('lineItem', lineItem);

    const element = getColumn('tax', 'service-charge-row');
    const checkbox = element.querySelector('cos-checkbox');
    expect(checkbox).toBeDefined();
    expect(checkbox).toHaveClass('cos-checkbox-disabled');
  });

  /**
   * Total line
   */

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
    hasFormattedPrice(lineItem.Totals.Amount, element, 2);
    expect(element).toHaveClass('text-right');
  });
});
