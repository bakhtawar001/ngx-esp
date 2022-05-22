import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { FormatPricePipe } from '@smartlink/products';
import {
  ProductChargesTableComponent,
  ProductChargesTableComponentModule,
} from './product-charges-table.component';

describe('ProductChargesTableComponent', () => {
  let spectator: Spectator<ProductChargesTableComponent>;
  let method: any;

  const createComponent = createComponentFactory({
    component: ProductChargesTableComponent,
    imports: [ProductChargesTableComponentModule],
  });

  beforeEach(() => {
    method = {
      Name: 'Embroidery',
      singlePrices: [
        {
          TypeCode: 'DGCH',
          Type: 'Digitizing Charge',
          Description: 'Embroidery',
          Prices: [
            {
              Quantity: {
                From: 1,
                To: 2147483647,
                $index: 1,
              },
              Price: 13.333,
              Cost: 8,
              DiscountCode: 'R',
              CurrencyCode: 'USD',
              IsQUR: false,
            },
          ],
          PriceIncludes: 'per 1,000 stitches. ',
          IsRequired: true,
        },
      ],
      multiplePrices: [
        {
          TypeCode: 'RNCH',
          Type: 'Run Charge',
          Description: 'Screen Printed Plastisol Heat Transfer',
          Prices: [
            {
              Quantity: {
                From: 48,
                To: 143,
                $index: 1,
              },
              Price: 5,
              Cost: 3,
              DiscountCode: 'R',
              CurrencyCode: 'USD',
              IsQUR: false,
            },
          ],
          PriceIncludes: '1st Color',
          UsageLevelCode: 'PQTY',
          UsageLevel: 'Per Quantity',
          IsRequired: true,
        },
      ],
    };

    spectator = createComponent({
      props: {
        method,
      },
    });
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  describe('Product single prices table', () => {
    // TODO: Fix this test, identify how change detection works for array
    // it('should not show table', () => {
    //   method.singlePrices = [];
    //   spectator.detectChanges();
    //   const tableElement = spectator.query('.product-single-prices-table');
    //   expect(tableElement).not.toExist();
    // });

    it('should show correct table headers', () => {
      const tableElement = spectator.query('.product-single-prices-table');
      const tableHeader = tableElement.querySelectorAll('.cos-header-cell');
      expect(tableHeader[0].textContent).toContain(`${method.Name} Charges`);
      expect(tableHeader[1].textContent).toContain('Price');
      expect(tableHeader[2].textContent).toContain('Cost');
      expect(tableHeader[3].textContent).toContain('Price Code');
    });

    describe('Product Charge type', () => {
      it('should show correct charges type', () => {
        method.singlePrices[0].Type = 'Test Charge';
        spectator.detectChanges();
        const tableElement = spectator.query('.product-single-prices-table');
        const description = tableElement.querySelector('.product-description');
        expect(description.textContent).toContain(method.singlePrices[0].Type);
      });

      it('should not show priceIncludes for single price products', () => {
        method.singlePrices[0].PriceIncludes = null;
        spectator.detectChanges();
        const tableElement = spectator.query('.product-single-prices-table');
        const productPriceIncludes = tableElement.querySelector(
          '.product-price-includes'
        );
        expect(productPriceIncludes).not.toExist();
      });

      it('should show correct priceIncludes for single price products', () => {
        method.singlePrices[0].PriceIncludes = 'test price includes value';
        spectator.detectChanges();
        const tableElement = spectator.query('.product-single-prices-table');
        const productPriceIncludes = tableElement.querySelector(
          '.product-price-includes'
        );
        expect(productPriceIncludes.textContent).toContain(
          method.singlePrices[0].PriceIncludes
        );
      });

      it('should not show product usage level', () => {
        method.singlePrices[0].UsageLevel = null;
        spectator.detectChanges();
        const tableElement = spectator.query('.product-single-prices-table');
        const productUsageLevel = tableElement.querySelector(
          '.product-usage-level'
        );
        expect(productUsageLevel).not.toExist();
      });

      it('should show correct product usage level', () => {
        method.singlePrices[0].UsageLevel = 'test product usage level value';
        spectator.detectChanges();
        const tableElement = spectator.query('.product-single-prices-table');
        const productUsageLevel = tableElement.querySelector(
          '.product-usage-level'
        );
        expect(productUsageLevel.textContent).toContain(
          method.singlePrices[0].UsageLevel
        );
      });
    });

    describe('Product Price', () => {
      it('should show correct product Price for single price products', () => {
        method.singlePrices[0].Prices[0] = {
          Quantity: {
            From: 1,
            To: 2147483647,
            $index: 1,
          },
          Price: 13.333,
          Cost: 8,
          DiscountCode: 'R',
          CurrencyCode: 'USD',
          IsQUR: false,
        };
        spectator.detectChanges();
        const pipe = new FormatPricePipe();
        const price = pipe.transform(method.singlePrices[0].Prices[0], 'Price');
        const tableElement = spectator.query('.product-single-prices-table');
        const productPrice = tableElement.querySelector('.product-price');
        expect(productPrice.textContent).toContain(price);
      });
    });

    describe('Product Cost', () => {
      it('should show correct Cost', () => {
        method.singlePrices[0].Prices[0] = {
          Quantity: {
            From: 1,
            To: 2147483647,
            $index: 1,
          },
          Price: 13.333,
          Cost: 8,
          DiscountCode: 'R',
          CurrencyCode: 'USD',
          IsQUR: false,
        };
        spectator.detectChanges();
        const pipe = new FormatPricePipe();
        const cost = pipe.transform(method.singlePrices[0].Prices[0], 'Cost');
        const tableElement = spectator.query('.product-single-prices-table');
        const productCost = tableElement.querySelector('.product-cost');
        expect(productCost.textContent).toContain(cost);
      });
    });

    describe('Price Code', () => {
      it('should show correct Price Codes', () => {
        method.singlePrices[0].Prices[0].DiscountCode = 'Test Code';
        spectator.detectChanges();
        const tableElement = spectator.query('.product-single-prices-table');
        const productPriceCode = tableElement.querySelector(
          '.product-price-code'
        );
        expect(productPriceCode.textContent).toContain(
          method.singlePrices[0].Prices[0].DiscountCode
        );
      });
    });
  });

  describe('Product multiple prices table', () => {
    // TODO: Fix this test, identify how change detection works for array
    // it('should not show table', () => {
    //   method.multiplePrices = [];
    //   spectator.detectChanges();
    //   const multiplePricesHeader = spectator.query('.product-multiple-price-header');
    //   expect(multiplePricesHeader).not.toExist();
    // });

    it('should show correct product charge type for method', () => {
      method.multiplePrices[0].Type = 'Test type';
      method.Name = 'Test Name';
      spectator.detectChanges();
      const multiplePricesHeader = spectator.query(
        '.product-multiple-price-header'
      );
      expect(multiplePricesHeader).toHaveText(
        `${method.multiplePrices[0].Type} for ${method.Name}`
      );
    });

    describe('Product Charge type', () => {
      it('should not show priceIncludes', () => {
        method.multiplePrices[0].PriceIncludes = null;
        spectator.detectChanges();
        const productPriceIncludes = spectator.query(
          '.product-multiplePrice-Includes'
        );
        expect(productPriceIncludes).not.toExist();
      });

      it('should show correct priceIncludes', () => {
        method.multiplePrices[0].PriceIncludes = 'test price includes value';
        spectator.detectChanges();
        const productPriceIncludes = spectator.query(
          '.product-multiplePrice-Includes'
        );
        expect(productPriceIncludes).toHaveText(
          method.multiplePrices[0].PriceIncludes
        );
      });

      it('should not show product usage level', () => {
        method.multiplePrices[0].UsageLevel = null;
        spectator.detectChanges();
        const productUsageLevel = spectator.query(
          '.product-multiplePrice-UsageLevel'
        );
        expect(productUsageLevel).not.toExist();
      });

      it('should show correct product usage level', () => {
        method.multiplePrices[0].UsageLevel = 'test product usage level value';
        spectator.detectChanges();
        const productUsageLevel = spectator.query(
          '.product-multiplePrice-UsageLevel'
        );
        expect(productUsageLevel).toHaveText(
          method.multiplePrices[0].UsageLevel
        );
      });
    });

    it('should show correct multiple prices table headers', () => {
      const tableElement = spectator.query('.product-multiple-prices-table');
      const tableHeader = tableElement.querySelectorAll('.cos-header-cell');
      expect(tableHeader[0].textContent).toContain('Quantity');
      expect(tableHeader[1].textContent).toContain('Price');
      expect(tableHeader[2].textContent).toContain('Cost');
      expect(tableHeader[3].textContent).toContain('Price Code');
    });

    describe('Product Price', () => {
      it('should show correct product Price for multiple price products', () => {
        method.multiplePrices[0].Prices[0] = {
          Quantity: {
            From: 48,
            To: 143,
            $index: 1,
          },
          Price: 5,
          Cost: 3,
          DiscountCode: 'R',
          CurrencyCode: 'USD',
          IsQUR: false,
        };
        spectator.detectChanges();
        const pipe = new FormatPricePipe();
        const price = pipe.transform(
          method.multiplePrices[0].Prices[0],
          'Price'
        );
        const tableElement = spectator.query('.product-multiple-prices-table');
        const productPrice = tableElement.querySelector('.product-price');
        expect(productPrice.textContent).toContain(price);
      });
    });

    describe('Product Cost', () => {
      it('should show correct product cost for multiple price products', () => {
        method.multiplePrices[0].Prices[0] = {
          Quantity: {
            From: 48,
            To: 143,
            $index: 1,
          },
          Price: 5,
          Cost: 3,
          DiscountCode: 'R',
          CurrencyCode: 'USD',
          IsQUR: false,
        };
        spectator.detectChanges();
        const pipe = new FormatPricePipe();
        const cost = pipe.transform(method.multiplePrices[0].Prices[0], 'Cost');
        const tableElement = spectator.query('.product-multiple-prices-table');
        const productCost = tableElement.querySelector('.product-cost');
        expect(productCost.textContent).toContain(cost);
      });
    });

    describe('Product Discount code', () => {
      it('should show correct code', () => {
        method.multiplePrices[0].Prices[0].DiscountCode = 'Test Code';
        spectator.detectChanges();
        const tableElement = spectator.query('.product-multiple-prices-table');
        const productCost = tableElement.querySelector('.product-price-code');
        expect(productCost.textContent).toContain(
          method.multiplePrices[0].Prices[0].DiscountCode
        );
      });
    });
  });
});
