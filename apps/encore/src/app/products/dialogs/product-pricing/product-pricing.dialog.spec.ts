import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  ProductPricingDialog,
  ProductPricingDialogModule,
} from './product-pricing.dialog';

const variants = [
  {
    Id: 832871274,
    Name: '128 MB',
    Description: 'Size: 128 MB',
    Number: 'USB12221-128',
    Values: [
      {
        Id: 784201701,
        Name: 'Size',
        Description: 'Size',
        Code: 'SIZE',
        Values: [
          {
            Id: 786632829,
            Name: '128 MB',
            Seq: 1,
          },
        ],
      },
    ],
    Attributes: {
      Sizes: {
        Values: [
          {
            Code: 'QOFA',
            Name: '128 MB',
            ProductNumber: 'USB12221-128',
            $index: 3,
          },
        ],
      },
    },
    Prices: [
      {
        Quantity: {
          From: 50,
          To: 99,
          $index: 1,
        },
        Price: 7.67,
        Cost: 4.602,
        DiscountCode: 'R',
        CurrencyCode: 'USD',
        IsQUR: false,
      },
      {
        Quantity: {
          From: 100,
          To: 249,
          $index: 1,
        },
        Price: 6.696,
        Cost: 4.018,
        DiscountCode: 'R',
        CurrencyCode: 'USD',
        IsQUR: false,
      },
      {
        Quantity: {
          From: 250,
          To: 499,
          $index: 1,
        },
        Price: 6.13,
        Cost: 3.678,
        DiscountCode: 'R',
        CurrencyCode: 'USD',
        IsQUR: false,
      },
      {
        Quantity: {
          From: 500,
          To: 999,
          $index: 1,
        },
        Price: 5.862,
        Cost: 3.517,
        DiscountCode: 'R',
        CurrencyCode: 'USD',
        IsQUR: false,
      },
      {
        Quantity: {
          From: 1000,
          To: 2499,
          $index: 1,
        },
        Price: 5.461,
        Cost: 3.277,
        DiscountCode: 'R',
        CurrencyCode: 'USD',
        IsQUR: false,
      },
      {
        Quantity: {
          From: 2500,
          To: 4999,
          $index: 1,
        },
        Price: 5.254,
        Cost: 3.152,
        DiscountCode: 'R',
        CurrencyCode: 'USD',
        IsQUR: false,
      },
      {
        Quantity: {
          From: 5000,
          To: 2147483647,
          $index: 1,
        },
        Price: 5.079,
        Cost: 3.047,
        DiscountCode: 'R',
        CurrencyCode: 'USD',
        IsQUR: false,
      },
    ],
    PriceIncludes:
      'Shock Resistance, Up to 10 years warranty & Full color print!',
  },
  {
    Id: 832871275,
    Name: '256 MB',
    Description: 'Size: 256 MB',
    Number: 'USB12221-256',
    Values: [
      {
        Id: 784201701,
        Name: 'Size',
        Description: 'Size',
        Code: 'SIZE',
        Values: [
          {
            Id: 786632828,
            Name: '256 MB',
            Seq: 2,
          },
        ],
      },
    ],
    Attributes: {
      Sizes: {
        Values: [
          {
            Code: 'QOFA',
            Name: '256 MB',
            ProductNumber: 'USB12221-256',
            $index: 3,
          },
        ],
      },
    },
    Prices: [
      {
        Quantity: {
          From: 50,
          To: 99,
          $index: 1,
        },
        Price: 8.591,
        Cost: 5.155,
        DiscountCode: 'R',
        CurrencyCode: 'USD',
        IsQUR: false,
      },
      {
        Quantity: {
          From: 100,
          To: 249,
          $index: 1,
        },
        Price: 7.585,
        Cost: 4.551,
        DiscountCode: 'R',
        CurrencyCode: 'USD',
        IsQUR: false,
      },
      {
        Quantity: {
          From: 250,
          To: 499,
          $index: 1,
        },
        Price: 7,
        Cost: 4.2,
        DiscountCode: 'R',
        CurrencyCode: 'USD',
        IsQUR: false,
      },
      {
        Quantity: {
          From: 500,
          To: 999,
          $index: 1,
        },
        Price: 6.713,
        Cost: 4.028,
        DiscountCode: 'R',
        CurrencyCode: 'USD',
        IsQUR: false,
      },
      {
        Quantity: {
          From: 1000,
          To: 2499,
          $index: 1,
        },
        Price: 6.264,
        Cost: 3.758,
        DiscountCode: 'R',
        CurrencyCode: 'USD',
        IsQUR: false,
      },
      {
        Quantity: {
          From: 2500,
          To: 4999,
          $index: 1,
        },
        Price: 6.033,
        Cost: 3.62,
        DiscountCode: 'R',
        CurrencyCode: 'USD',
        IsQUR: false,
      },
      {
        Quantity: {
          From: 5000,
          To: 2147483647,
          $index: 1,
        },
        Price: 5.833,
        Cost: 3.5,
        DiscountCode: 'R',
        CurrencyCode: 'USD',
        IsQUR: false,
      },
    ],
    PriceIncludes:
      'Shock Resistance, Up to 10 years warranty & Full color print!',
  },
];

describe('ProductPricingDialog', () => {
  let spectator: Spectator<ProductPricingDialog>;

  const createComponent = createComponentFactory({
    component: ProductPricingDialog,
    imports: [ProductPricingDialogModule],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: { variants } },
      { provide: MatDialogRef, useValue: {} },
    ],
  });

  beforeEach(() => (spectator = createComponent()));

  describe('Product Pricing', () => {
    describe('Product Numbers', () => {
      it('should display correctly if product has multiple price grids configured with product numbers given on all products', () => {
        const pricingElements = spectator.queryAll('.variant-number');
        expect(pricingElements.length).toEqual(2);
        expect(pricingElements[0].textContent).toContain('USB12221-128');
        expect(pricingElements[1].textContent).toContain('USB12221-256');
      });

      it('should display correctly if product has some multiple price grids configured with product numbers given on some products', () => {
        delete spectator.component.data.variants[1].Number;
        spectator.detectChanges();

        const pricingElements = spectator.queryAll('.variant-number');

        expect(pricingElements.length).toEqual(1);
        expect(pricingElements[0].textContent).toContain('USB12221-128');
      });
    });

    describe('Product Variants', () => {
      it('should display correctly if product has variants', () => {
        const variantNameElements = spectator.queryAll('.variant-name');
        expect(variantNameElements.length).toEqual(2);
        expect(variantNameElements[0].textContent).toContain('128 MB');
        expect(variantNameElements[1].textContent).toContain('256 MB');
      });

      it('should display correctly if product variant has values', () => {
        const variantValueElements = spectator.queryAll('.variant-value');
        expect(variantValueElements.length).toEqual(2);
        expect(variantValueElements[0].textContent).toContain('Size');
        expect(variantValueElements[1].textContent).toContain('Size');
      });
    });
  });
});
