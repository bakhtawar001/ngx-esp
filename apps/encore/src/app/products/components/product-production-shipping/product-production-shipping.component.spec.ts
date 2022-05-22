import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { Product } from '@smartlink/models';
import { ProductsMockDb } from '@smartlink/products/mocks';
import { EvalDisplayValuePipe, MadeInUsaPipe } from '@smartlink/products';

import {
  ProductProductionShippingComponent,
  ProductProductionShippingComponentModule,
} from './product-production-shipping.component';

describe('ProductProductionShippingComponent', () => {
  let spectator: Spectator<ProductProductionShippingComponent>;
  let product: Product;
  const createComponent = createComponentFactory({
    component: ProductProductionShippingComponent,
    imports: [ProductProductionShippingComponentModule],
  });

  beforeEach(() => {
    product = ProductsMockDb.products[0];

    spectator = createComponent({
      props: {
        product,
      },
    });
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  describe('Product Rush Time Details', () => {
    it('should not display details with no rush service', () => {
      product.HasRushService = false;
      spectator.detectChanges();
      expect(spectator.query('.product-rush-service')).not.toExist();
    });

    it('should display correct rush service details', () => {
      const pipe = new EvalDisplayValuePipe();
      const rushService = pipe.transform(product.HasRushService);
      const productRushElement = spectator.query('.product-rush-service');
      expect(productRushElement).toHaveText(rushService);
    });

    it("should show 'Yes' value when rush service available", () => {
      product.HasRushService = true;
      spectator.detectChanges();
      const pipe = new EvalDisplayValuePipe();
      const rushService = pipe.transform(product.HasRushService);
      const productRushElement = spectator.query('.product-rush-service');
      expect(productRushElement).toHaveText(rushService);
    });

    describe('Product Rush Time Container Details', () => {
      it('should display correct number of rush time details', () => {
        const productRushElements = spectator.queryAll(
          '.product-rush-time-container'
        );
        expect(productRushElements.length).toEqual(product.RushTime.length);
      });

      it('should display correct number of rush name details', () => {
        const productRushElements = spectator.queryAll(
          '.product-rush-time-name'
        );
        productRushElements.forEach((productRushElement, index) => {
          expect(productRushElement).toHaveExactText(
            product.RushTime[index].Name
          );
        });
      });

      it('should display correct number of rush description details', () => {
        const productRushElements = spectator.queryAll(
          '.product-rush-time-description'
        );
        productRushElements.forEach((productRushElement, index) => {
          expect(productRushElement).toHaveText(
            product.RushTime[index].Description
          );
        });
      });
    });
  });

  describe('Product Production Time Details', () => {
    it('should not display Production Time details', () => {
      product.ProductionTime = null;
      spectator.detectChanges();
      expect(spectator.query('.product-production-time')).not.toExist();
    });

    it('should display correct number of production time details', () => {
      const productElements = spectator.queryAll(
        '.product-production-time-container'
      );
      expect(productElements.length).toEqual(product.ProductionTime.length);
    });

    it('should display correct production time with comments', () => {
      const productElements = spectator.queryAll(
        '.product-production-time-name'
      );
      const prodTimeComments = spectator.queryAll(
        '.product-production-time-description'
      );
      productElements.forEach((productElement, index) => {
        expect(productElement).toHaveExactText(
          product.ProductionTime[index].Name
        );
      });
      prodTimeComments.forEach((productElement, index) => {
        expect(productElement).toHaveText(
          product.ProductionTime[index].Description
        );
      });
    });

    it('should display correct production time without comments', () => {
      product.ProductionTime = [
        {
          Name: '3-7 business days',
          Description: null,
          Days: 10,
        },
      ];
      spectator.detectChanges();
      const productElements = spectator.queryAll(
        '.product-production-time-name'
      );
      const prodTimeComments = spectator.queryAll(
        '.product-production-time-description'
      );
      productElements.forEach((productElement, index) => {
        expect(productElement).toHaveExactText(
          product.ProductionTime[index].Name
        );
      });
      prodTimeComments.forEach((productElement) => {
        expect(productElement?.textContent?.trim()?.length).toBe(0);
      });
    });
  });

  describe('Product Shipping Details', () => {
    it('should display correct Shipping options label', () => {
      const shippingLabel = spectator.query('.product-shipping-options-label');
      expect(shippingLabel).toHaveExactText(' Shipping Options ');
    });

    it('should display correct shipping option details', () => {
      const options = (
        product?.Shipping?.Options?.Values || product?.Shipping?.Options?.Groups
      )
        ?.map((option) => option.Name || option)
        .join(', ');
      const productElement = spectator.query('.product-shipping-options');
      expect(productElement).toHaveExactText(options);
    });

    it('should display correct shipping option details when multiple shipping details available', () => {
      product.Shipping.Options = {
        Values: [
          {
            Name: 'Drop Shipment',
            $index: 3,
          },
          {
            Name: 'Home Shipment',
            $index: 3,
          },
        ],
      };
      spectator.detectChanges();
      spectator.component.options = (
        product?.Shipping?.Options?.Values || product?.Shipping?.Options?.Groups
      )
        ?.map((option) => option.Name || option)
        .join(', ');
      spectator.detectChanges();
      const productElement = spectator.query('.product-shipping-options');
      expect(productElement.innerHTML).toContain(spectator.component.options);
    });

    it('should not display shipping dimension', () => {
      product.Shipping.Dimensions = null;
      spectator.detectChanges();
      expect(spectator.query('.product-shipping-dimension')).not.toExist();
    });

    it('should display correct shipping dimensions', () => {
      const dimensions = product.Shipping.Dimensions.Description;
      const productElement = spectator.query('.product-shipping-dimension');
      expect(productElement).toHaveText(dimensions);
    });

    it('should not display Shipping Option details', () => {
      product.Shipping.Options.Values = [];
      spectator.detectChanges();
      expect(spectator.query('.product-shipping-option')).not.toExist();
    });

    describe('Product Shipping Point Details', () => {
      it('should not display Shipping points details', () => {
        product.Shipping.FOBPoints.Values = [];
        spectator.detectChanges();
        expect(spectator.query('.product-shipping-point')).not.toExist();
      });

      it('should display correct number of shipping points details', () => {
        const productElements = spectator.queryAll('.product-shipping-point');
        expect(productElements.length).toEqual(
          product.Shipping.FOBPoints.Values.length
        );
      });

      it('should display correct shipping points name details', () => {
        const productElements = spectator.queryAll(
          '.product-shipping-point-fob-points'
        );
        productElements.forEach((productElement, index) => {
          expect(productElement).toHaveExactText(
            product.Shipping.FOBPoints.Values[index].Name
          );
        });
      });

      it('should display correct number of shipping points name details when they are multiple', () => {
        product.Shipping.FOBPoints = {
          Values: [
            {
              Code: '$2HK',
              Name: 'Ontario,  CA 91761 USA',
              $index: 3,
            },
            {
              Code: '$1HK',
              Name: 'Ontario,  CA 91761 USA',
              $index: 3,
            },
          ],
        };
        const productElements = spectator.queryAll(
          '.product-shipping-point-fob-points'
        );
        productElements.forEach((productElement, index) => {
          expect(productElement).toHaveExactText(
            product.Shipping.FOBPoints.Values[index].Name
          );
        });
      });
    });

    describe('Product Packagings Details', () => {
      it('should not display packaging details', () => {
        product.Packaging = null;
        spectator.detectChanges();
        expect(spectator.query('.product-packaging-header')).not.toExist();
      });

      it('should display correct packaging details when single packaging option is available', () => {
        product.Packaging = [
          {
            Name: 'Packaging',
            Groups: [
              {
                Name: 'Poly Bag',
              },
            ],
          },
        ];
        spectator.detectChanges();
        const productElement = spectator.query('.product-packaging');
        const packaging = product?.Packaging?.map((element) =>
          (element.Values || element.Groups)?.map(
            (value) => value.Name || value
          )
        ).join(', ');
        expect(productElement).toHaveExactText(packaging);
      });

      it('should display correct packaging details when multiple packaging options are available', () => {
        product.Packaging = [
          {
            Name: 'Packaging',
            Groups: [
              {
                Name: 'Poly Bag',
              },
            ],
          },
          {
            Name: 'Packaging',
            Groups: [
              {
                Name: 'Cotton Bag',
              },
            ],
          },
        ];
        spectator.detectChanges();
        const productElement = spectator.query('.product-packaging');
        spectator.component.packaging = product?.Packaging?.map((element) =>
          (element.Values || element.Groups)?.map(
            (value) => value.Name || value
          )
        ).join(', ');
        spectator.detectChanges();
        expect(productElement).toHaveText(spectator.component.packaging);
      });

      it('should display correct item per package value', () => {
        const items = product.Shipping.ItemsPerPackage;
        const packagingUnit = product.Shipping.PackageUnit;
        const productElement = spectator.query('.item-per-package');
        expect(productElement).toHaveExactText(
          ` ${items}   per ${packagingUnit} `
        );
      });
    });
  });
  describe('Can be shipped in plain box', () => {
    it("should display with 'No' value when plain box option not available", () => {
      product.Shipping.PackageInPlainBox = false;
      spectator.detectChanges();
      const pipe = new EvalDisplayValuePipe();
      const value = pipe.transform(product.Shipping.PackageInPlainBox);
      const productElement = spectator.query('.packaging-in-plain-box');
      expect(productElement).toHaveText(value);
    });

    it("should display with 'Yes' value when plain box option not available", () => {
      product.Shipping.PackageInPlainBox = true;
      spectator.detectChanges();
      const pipe = new EvalDisplayValuePipe();
      const value = pipe.transform(product.Shipping.PackageInPlainBox);
      const productElement = spectator.query('.packaging-in-plain-box');
      expect(productElement).toHaveText(value);
    });

    it('should display with Unspecified value when plain box option not available', () => {
      product.Shipping.PackageInPlainBox = null;
      spectator.detectChanges();
      const pipe = new EvalDisplayValuePipe();
      const value = pipe.transform(product.Shipping.PackageInPlainBox);
      const productElement = spectator.query('.packaging-in-plain-box');
      expect(productElement).toHaveText('Supplier has not specified');
    });
  });

  it('Additional Shipping should display correctly', () => {
    const weights = product?.Shipping?.Weight?.Values?.map(
      (value) => value.Name || value
    ).join(', ');
    const productWeightElement = spectator.query('.product-weight');
    expect(productWeightElement).toHaveExactText(weights);
  });

  it('Additional Shipping should display when maximum charecters', () => {
    product.Shipping.Weight.Values = [
      'Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping',
      'Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping Information DATA Additional Shipping',
    ];
    spectator.component.weights = product.Shipping.Weight.Values.map(
      (value) => value.Name || value
    ).join(', ');
    const weights = product?.Shipping?.Weight?.Values?.map(
      (value) => value.Name || value
    ).join(', ');
    spectator.detectChanges();
    expect(spectator.query('.product-weight')).toHaveExactText(weights);
  });

  it('Additional Shipping should not display when not available', () => {
    product.Shipping.Weight = null;
    spectator.component.weights = null;
    spectator.detectChanges();
    expect(spectator.query('.product-weight')).toBeFalsy();
  });

  describe('Product Origin', () => {
    describe('Made in USA', () => {
      it('should display correct label', () => {
        const label = spectator.query('.made-in-USA-label');
        expect(label).toHaveExactText('Made in USA');
      });

      it("should display value as 'Yes' when Made in USA is true", () => {
        product.Origin = ['USA'];
        spectator.detectChanges();
        const pipe = new MadeInUsaPipe();
        const value = pipe.transform(product.Origin);
        const productElement = spectator.query('.product-origin-title');
        expect(productElement).toHaveExactText(value);
      });

      it("should display value as 'No' when Made in USA is false", () => {
        product.Origin = ['Canada'];
        spectator.detectChanges();
        const pipe = new MadeInUsaPipe();
        const value = pipe.transform(product.Origin);
        const productElement = spectator.query('.product-origin-title');
        expect(productElement).toHaveExactText(value);
      });

      it('should display value as Unspecified when no country is selected', () => {
        product.Origin = [];
        spectator.detectChanges();
        const pipe = new MadeInUsaPipe();
        const value = pipe.transform(product.Origin);
        const productElement = spectator.query('.product-origin-title');
        expect(productElement).toHaveExactText(value);
      });

      it('should display correct data when multiple countries are selected along with USA', () => {
        product.Origin = ['USA', 'Canada'];
        spectator.detectChanges();
        const pipe = new MadeInUsaPipe();
        const value = pipe.transform(product.Origin);
        const productEle = spectator.query('.product-origin-title');
        expect(productEle).toHaveExactText(value);
        const origins = product.Origin?.join(', ');
        const productElement = spectator.query('.product-origin');
        expect(productElement).toHaveExactText(origins);
      });
    });

    it('should display correct data when single origin values', () => {
      product.Origin = ['USA'];
      spectator.detectChanges();
      const origins = product.Origin?.join(', ');
      const productElement = spectator.query('.product-origin');
      expect(productElement).toHaveExactText(origins);
    });

    it('should display correct data when multiple origin values', () => {
      const origins = product.Origin?.join(', ');
      const productElement = spectator.query('.product-origin');
      expect(productElement).toHaveExactText(origins);
    });

    it('should not display product origin values', () => {
      product.Origin = null;
      spectator.detectChanges();
      expect(spectator.query('.product-origin-section')).not.toExist();
    });
  });

  describe('Product shipping estimate', () => {
    it('should not display estimate details', () => {
      product.Shipping.ItemsPerPackage = null;
      spectator.detectChanges();
      expect(spectator.query('.product-shipping-estimate')).not.toExist();
    });

    it('should display correct values for estimate', () => {
      product.Shipping.ItemsPerPackage = 10;
      product.Shipping.PackageUnit = 'Box';
      spectator.detectChanges();
      const packageUnit = spectator.query('.product-packaging-unit');
      expect(spectator.query('.item-per-package')).toHaveText(
        `${product.Shipping.ItemsPerPackage}`
      );
      expect(packageUnit).toHaveText(`per ${product.Shipping.PackageUnit}`);
    });

    it('should not display packaging unit', () => {
      product.Shipping.PackageUnit = null;
      spectator.detectChanges();
      expect(spectator.query('.product-packaging-unit')).not.toExist();
    });
  });
});
