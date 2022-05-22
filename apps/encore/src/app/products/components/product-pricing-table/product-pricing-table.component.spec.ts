import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  multiplePriceGridBasedOnSingleCriteria,
  singlePriceGridFiveQuantities,
  singlePriceGridMoreThanFiveQuantities,
  singlePriceGridSingleQuantity,
  singlePriceGridWithMaximumDataDisplay,
  singlePriceGridWithQURQuantities,
} from '@smartlink/products/mocks';
import {
  ProductPricingTableComponent,
  ProductPricingTableComponentModule,
} from './product-pricing-table.component';

describe('Product Pricing Matrix', () => {
  let spectator: Spectator<ProductPricingTableComponent>;
  let preferred;
  let pricing: any;

  const createComponent = createComponentFactory({
    component: ProductPricingTableComponent,
    imports: [ProductPricingTableComponentModule],
  });

  describe('Single Grid Pricing with only one quantity', () => {
    beforeEach(() => {
      pricing = { ...singlePriceGridSingleQuantity };
      spectator = createComponent({
        props: {
          pricing,
          preferred,
        },
      });
    });

    it('should display Quantity, Catalog Price, Net Cost Correctly', () => {
      const tableElement = spectator.query('.product-prices-table');
      const quantity = tableElement.querySelectorAll('.quantity');
      const catalogPrice = tableElement.querySelectorAll('.catalog-price');
      const netCost = tableElement.querySelectorAll('.net-cost');
      expect(quantity[0].innerHTML).toEqual(
        singlePriceGridSingleQuantity.Prices[0].Quantity.From.toString()
      );
      expect(catalogPrice[0].innerHTML).toEqual('$100.00');
      expect(netCost[0].innerHTML).toEqual('$85.00');
    });

    it('should display profit correctly', () => {
      const tableElement = spectator.query('.product-prices-table');
      const profit = tableElement.querySelectorAll('.profit');
      expect(profit[0].innerHTML).toEqual(`$15.00`);
    });

    it('should not display preferred price', () => {
      const tableElement = spectator.query('.product-prices-table');
      const preferredPrice = tableElement.querySelectorAll('.preferred-price');
      expect(preferredPrice.length).toEqual(0);
    });

    it('should not display show more link', () => {
      const showMoreLink = spectator.query('.show-more-link');
      expect(showMoreLink).toBeFalsy();
    });

    it('should display Quantity, Catalog Price, Net Cost with currency sign', () => {
      const tableElement = spectator.query('.product-prices-table');
      const catalogPrice = tableElement.querySelectorAll('.catalog-price');
      const netCost = tableElement.querySelectorAll('.net-cost');
      const profit = tableElement.querySelectorAll('.profit');
      expect(catalogPrice[0].innerHTML).toContain('$');
      expect(netCost[0].innerHTML).toContain('$');
      expect(profit[0].innerHTML).toContain('$');
    });

    it('should not display price-includes', () => {
      const priceIncludes = spectator.query('.price-includes');
      expect(priceIncludes).toBeFalsy();
    });

    it('should display disclaimer correctly', () => {
      const disclaimer = spectator.query('.disclaimer');
      expect(disclaimer.innerHTML).toEqual(
        ' (W) Price subject to change without notice, please verify with Supplier. '
      );
    });
  });

  describe('Single Grid Pricing with five quantities', () => {
    beforeEach(() => {
      pricing = { ...singlePriceGridFiveQuantities };
      spectator = createComponent({
        props: {
          pricing,
          preferred,
        },
      });
    });

    it('should display 5 rows, in order of quantity low to high', () => {
      const tableElement = spectator.query('.product-prices-table');
      const quantity = tableElement.querySelectorAll('.quantity');
      expect(quantity.length).toEqual(5);
      expect(quantity[0].innerHTML).toEqual('10');
      expect(quantity[4].innerHTML).toEqual('50');
    });

    it('should display Quantity, Catalog Price, Net Cost Correctly', () => {
      const tableElement = spectator.query('.product-prices-table');
      const quantity = tableElement.querySelectorAll('.quantity');
      const catalogPrice = tableElement.querySelectorAll('.catalog-price');
      const netCost = tableElement.querySelectorAll('.net-cost');
      expect(quantity[0].innerHTML).toEqual(
        singlePriceGridFiveQuantities.Prices[0].Quantity.From.toString()
      );
      expect(catalogPrice[0].innerHTML).toEqual('$100.00');
      expect(netCost[0].innerHTML).toEqual('$85.00');
      expect(quantity[4].innerHTML).toEqual(
        singlePriceGridFiveQuantities.Prices[4].Quantity.From.toString()
      );
      expect(catalogPrice[4].innerHTML).toEqual('$60.00');
      expect(netCost[4].innerHTML).toEqual('$45.00');
    });

    it('should display profit correctly', () => {
      const tableElement = spectator.query('.product-prices-table');
      const profit = tableElement.querySelectorAll('.profit');
      expect(profit[0].innerHTML).toEqual(`$15.00`);
      expect(profit[4].innerHTML).toEqual(`$15.00`);
    });

    it('should not display preferred price', () => {
      const tableElement = spectator.query('.product-prices-table');
      const preferredPrice = tableElement.querySelectorAll('.preferred-price');
      expect(preferredPrice.length).toEqual(0);
    });

    it('should display Quantity, Catalog Price, Net Cost with currency sign', () => {
      const tableElement = spectator.query('.product-prices-table');
      const catalogPrice = tableElement.querySelectorAll('.catalog-price');
      const netCost = tableElement.querySelectorAll('.net-cost');
      const profit = tableElement.querySelectorAll('.profit');
      expect(catalogPrice[0].innerHTML).toContain('$');
      expect(netCost[0].innerHTML).toContain('$');
      expect(profit[0].innerHTML).toContain('$');
    });

    it('should not display show more link', () => {
      const showMoreLink = spectator.query('.show-more-link');
      expect(showMoreLink).toBeFalsy();
    });

    it('should not display price-includes', () => {
      const priceIncludes = spectator.query('.price-includes');
      expect(priceIncludes).toBeFalsy();
    });

    it('should display discount code correctly before the disclaimer', () => {
      const disclaimer = spectator.query('.disclaimer');
      expect(disclaimer.innerHTML).toContain('(3W2U)');
    });

    it('should display disclaimer correctly', () => {
      const disclaimer = spectator.query('.disclaimer');
      expect(disclaimer.innerHTML).toEqual(
        ' (3W2U) Price subject to change without notice, please verify with Supplier. '
      );
    });
  });

  describe('Single Grid Pricing with more than five quantities', () => {
    beforeEach(() => {
      pricing = { ...singlePriceGridMoreThanFiveQuantities };
      spectator = createComponent({
        props: {
          pricing,
          preferred,
        },
      });
    });

    it('should display 5 rows, in order of quantity low to high', () => {
      const tableElement = spectator.query('.product-prices-table');
      const quantity = tableElement.querySelectorAll('.quantity');
      expect(quantity.length).toEqual(5);
      expect(quantity[0].innerHTML).toEqual('10');
      expect(quantity[4].innerHTML).toEqual('50');
    });

    it('should display Quantity, Catalog Price, Net Cost Correctly with first 5 rows', () => {
      const tableElement = spectator.query('.product-prices-table');
      const quantity = tableElement.querySelectorAll('.quantity');
      const catalogPrice = tableElement.querySelectorAll('.catalog-price');
      const netCost = tableElement.querySelectorAll('.net-cost');
      expect(quantity[0].innerHTML).toEqual(
        singlePriceGridMoreThanFiveQuantities.Prices[0].Quantity.From.toString()
      );
      expect(catalogPrice[0].innerHTML).toEqual('$100.00');
      expect(netCost[0].innerHTML).toEqual('$85.00');
      expect(quantity[4].innerHTML).toEqual(
        singlePriceGridMoreThanFiveQuantities.Prices[4].Quantity.From.toString()
      );
      expect(catalogPrice[4].innerHTML).toEqual('$60.00');
      expect(netCost[4].innerHTML).toEqual('$51.00');
    });

    it('should display profit correctly with first 5 rows', () => {
      const tableElement = spectator.query('.product-prices-table');
      const profit = tableElement.querySelectorAll('.profit');
      expect(profit[0].innerHTML).toEqual(`$15.00`);
      expect(profit[4].innerHTML).toEqual(`$9.00`);
    });

    it('should not display preferred price', () => {
      const tableElement = spectator.query('.product-prices-table');
      const preferredPrice = tableElement.querySelectorAll('.preferred-price');
      expect(preferredPrice.length).toEqual(0);
    });

    it('should display Quantity, Catalog Price, Net Cost with currency sign', () => {
      const tableElement = spectator.query('.product-prices-table');
      const catalogPrice = tableElement.querySelectorAll('.catalog-price');
      const netCost = tableElement.querySelectorAll('.net-cost');
      const profit = tableElement.querySelectorAll('.profit');
      expect(catalogPrice[0].innerHTML).toContain('$');
      expect(netCost[0].innerHTML).toContain('$');
      expect(profit[0].innerHTML).toContain('$');
    });

    it('should display show more link and clicking on it shows all rows', () => {
      const showMoreLink = spectator.query('.show-more-link');
      expect(showMoreLink).toBeTruthy();
      spectator.click(showMoreLink);
      const tableElement = spectator.query('.product-prices-table');
      const quantity = tableElement.querySelectorAll('.quantity');
      expect(quantity.length).toEqual(10);
    });

    it('should display disclaimer correctly', () => {
      const disclaimer = spectator.query('.disclaimer');
      expect(disclaimer.innerHTML).toEqual(
        ' (10W) Price subject to change without notice, please verify with Supplier. '
      );
    });
  });

  describe('Single Grid Pricing with quantities and last column with QUR', () => {
    beforeEach(() => {
      pricing = { ...singlePriceGridWithQURQuantities };
      spectator = createComponent({
        props: {
          pricing,
          preferred,
        },
      });
    });

    it('should display 5 rows, in order of quantity low to high', () => {
      const tableElement = spectator.query('.product-prices-table');
      const quantity = tableElement.querySelectorAll('.quantity');
      expect(quantity.length).toEqual(5);
      expect(quantity[0].innerHTML).toEqual('1');
      expect(quantity[4].innerHTML).toEqual('8');
    });

    it('should display Quantity, Catalog Price, Net Cost Correctly with first 5 rows', () => {
      const tableElement = spectator.query('.product-prices-table');
      const quantity = tableElement.querySelectorAll('.quantity');
      const catalogPrice = tableElement.querySelectorAll('.catalog-price');
      const netCost = tableElement.querySelectorAll('.net-cost');
      expect(quantity[0].innerHTML).toEqual(
        singlePriceGridWithQURQuantities.Prices[0].Quantity.From.toString()
      );
      expect(catalogPrice[0].innerHTML).toEqual('$11.00');
      expect(netCost[0].innerHTML).toEqual('$4.40');
      expect(quantity[4].innerHTML).toEqual(
        singlePriceGridWithQURQuantities.Prices[4].Quantity.From.toString()
      );
      expect(catalogPrice[4].innerHTML).toEqual('$10.00');
      expect(netCost[4].innerHTML).toEqual('$4.00');
    });

    it('should display profit correctly with first 5 rows', () => {
      const tableElement = spectator.query('.product-prices-table');
      const profit = tableElement.querySelectorAll('.profit');
      expect(profit[0].innerHTML).toEqual(`$6.60`);
      expect(profit[4].innerHTML).toEqual(`$6.00`);
    });

    it('should not display preferred price', () => {
      const tableElement = spectator.query('.product-prices-table');
      const preferredPrice = tableElement.querySelectorAll('.preferred-price');
      expect(preferredPrice.length).toEqual(0);
    });

    it('should display Quantity, Catalog Price, Net Cost with currency sign', () => {
      const tableElement = spectator.query('.product-prices-table');
      const catalogPrice = tableElement.querySelectorAll('.catalog-price');
      const netCost = tableElement.querySelectorAll('.net-cost');
      const profit = tableElement.querySelectorAll('.profit');
      expect(catalogPrice[0].innerHTML).toContain('$');
      expect(netCost[0].innerHTML).toContain('$');
      expect(profit[0].innerHTML).toContain('$');
    });

    it('should display show more link', () => {
      const showMoreLink = spectator.query('.show-more-link');
      expect(showMoreLink).toBeTruthy();
      spectator.click(showMoreLink);
      const tableElement = spectator.query('.product-prices-table');
      const quantity = tableElement.querySelectorAll('.quantity');
      expect(quantity.length).toEqual(7);
    });

    it('should display QUR for Net Cost, Catalog Price', () => {
      const showMoreLink = spectator.query('.show-more-link');
      expect(showMoreLink).toBeTruthy();
      spectator.click(showMoreLink);
      const tableElement = spectator.query('.product-prices-table');
      const catalogPrice = tableElement.querySelectorAll('.catalog-price');
      const netCost = tableElement.querySelectorAll('.net-cost');
      const profit = tableElement.querySelectorAll('.profit');
      expect(catalogPrice[6].innerHTML).toContain('QUR');
      expect(netCost[6].innerHTML).toContain('QUR');
      expect(profit[6].innerHTML).toContain('N/A');
    });

    it('should display disclaimer correctly', () => {
      const disclaimer = spectator.query('.disclaimer');
      expect(disclaimer.innerHTML).toEqual(
        ' (6N) Price subject to change without notice, please verify with Supplier. '
      );
    });
  });

  describe('Single Grid Pricing with quantities with maximum data display', () => {
    beforeEach(() => {
      pricing = { ...singlePriceGridWithMaximumDataDisplay };
      spectator = createComponent({
        props: {
          pricing,
          preferred,
        },
      });
    });

    it('should display data correctly', () => {
      const tableElement = spectator.query('.product-prices-table');
      const showMoreLink = spectator.query('.show-more-link');
      spectator.click(showMoreLink);
      const quantity = tableElement.querySelectorAll('.quantity');
      const catalogPrice = tableElement.querySelectorAll('.catalog-price');
      const netCost = tableElement.querySelectorAll('.net-cost');
      const profit = tableElement.querySelectorAll('.profit');
      expect(quantity[0].innerHTML).toEqual(
        singlePriceGridWithMaximumDataDisplay.Prices[0].Quantity.From.toString()
      );
      expect(catalogPrice[0].innerHTML).toEqual('$1000000.00');
      expect(netCost[0].innerHTML).toEqual('$850000.00');
      expect(profit[0].innerHTML).toEqual('$150000.00');
      expect(quantity[4].innerHTML).toEqual(
        singlePriceGridWithMaximumDataDisplay.Prices[4].Quantity.From.toString()
      );
      expect(catalogPrice[4].innerHTML).toEqual('$600000.00');
      expect(netCost[4].innerHTML).toEqual('$510000.00');
      expect(profit[4].innerHTML).toEqual('$90000.00');
      expect(quantity[9].innerHTML).toEqual(
        singlePriceGridWithMaximumDataDisplay.Prices[9].Quantity.From.toString()
      );
      expect(catalogPrice[9].innerHTML).toEqual('$100000.00');
      expect(netCost[9].innerHTML).toEqual('$85000.00');
      expect(profit[9].innerHTML).toEqual('$15000.00');
    });
  });

  describe('Multiple Price Grid Display based on single criteria', () => {
    beforeEach(() => {
      pricing = { ...multiplePriceGridBasedOnSingleCriteria.Variants[0] };
      spectator = createComponent({
        props: {
          pricing,
          preferred,
        },
      });
    });

    it('should display Quantity, Catalog Price, Net Cost Correctly', () => {
      const tableElement = spectator.query('.product-prices-table');
      const quantity = tableElement.querySelectorAll('.quantity');
      const catalogPrice = tableElement.querySelectorAll('.catalog-price');
      const netCost = tableElement.querySelectorAll('.net-cost');
      expect(quantity[0].innerHTML).toEqual(
        multiplePriceGridBasedOnSingleCriteria.Variants[0].Prices[0].Quantity.From.toString()
      );
      expect(catalogPrice[0].innerHTML).toEqual('$100.00');
      expect(netCost[0].innerHTML).toEqual('$55.00');
    });

    it('should display profit correctly', () => {
      const tableElement = spectator.query('.product-prices-table');
      const profit = tableElement.querySelectorAll('.profit');
      expect(profit[0].innerHTML).toEqual(`$45.00`);
    });

    it('should not display preferred price', () => {
      const tableElement = spectator.query('.product-prices-table');
      const preferredPrice = tableElement.querySelectorAll('.preferred-price');
      expect(preferredPrice.length).toEqual(0);
    });

    it('should display price-includes', () => {
      const priceIncludes = spectator.query('.price-includes');
      expect(priceIncludes).toBeTruthy();
      expect(priceIncludes.innerHTML).toContain('Price grid 1 PI data');
    });

    it('should display Quantity, Catalog Price, Net Cost with currency sign', () => {
      const tableElement = spectator.query('.product-prices-table');
      const catalogPrice = tableElement.querySelectorAll('.catalog-price');
      const netCost = tableElement.querySelectorAll('.net-cost');
      const profit = tableElement.querySelectorAll('.profit');
      expect(catalogPrice[0].innerHTML).toContain('$');
      expect(netCost[0].innerHTML).toContain('$');
      expect(profit[0].innerHTML).toContain('$');
    });

    it('should display show more link', () => {
      const showMoreLink = spectator.query('.show-more-link');
      expect(showMoreLink).toBeTruthy();
      spectator.click(showMoreLink);
      const tableElement = spectator.query('.product-prices-table');
      const quantity = tableElement.querySelectorAll('.quantity');
      expect(quantity.length).toEqual(6);
    });

    it('should display disclaimer correctly', () => {
      const disclaimer = spectator.query('.disclaimer');
      expect(disclaimer.innerHTML).toEqual(
        ' (QW) Price subject to change without notice, please verify with Supplier. '
      );
    });

    it('should display 5 rows, in order of quantity low to high', () => {
      const showMoreLink = spectator.query('.show-more-link');
      expect(showMoreLink).toBeTruthy();
      spectator.click(showMoreLink);
      const tableElement = spectator.query('.product-prices-table');
      const quantity = tableElement.querySelectorAll('.quantity');
      expect(quantity[0].innerHTML).toEqual('10');
      expect(quantity[5].innerHTML).toEqual('60');
    });
  });
});
