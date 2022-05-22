import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthServiceConfig } from '@asi/auth';
import { CosToastService } from '@cosmos/components/notification';
import {
  CosProductMediaComponent,
  CosProductMediaModule,
} from '@cosmos/components/product-media';
import {
  CosProductVariantsComponent,
  CosProductVariantsModule,
} from '@cosmos/components/product-variant-details';
import {
  CosSupplierComponent,
  CosSupplierFooterComponent,
  CosSupplierModule,
} from '@cosmos/components/supplier';
import { AuthFacade } from '@esp/auth';
import { productToCollectionProduct } from '@esp/collections';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { Product } from '@smartlink/models';
import { FormatPriceRangePipe } from '@smartlink/products';
import { mockInventory, ProductsMockDb } from '@smartlink/products/mocks';
import { SuppliersMockDb } from '@smartlink/suppliers/mocks';
import * as faker from 'faker';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import { CollectionsDialogService } from '../../../collections/services';
import { AddToPresentationFlow } from '../../../projects/flows/add-to-presentation.flow';
import { ProductsDialogService } from '../../services';
import {
  ProductImprintMethodsComponent,
  ProductImprintMethodsComponentModule,
} from '../product-imprint-methods/product-imprint-methods.component';
import {
  ProductInfoComponent,
  ProductInfoComponentModule,
} from '../product-info/product-info.component';
import {
  ProductInventoryComponent,
  ProductInventoryComponentModule,
} from '../product-inventory/product-inventory.component';
import {
  ProductMatrixComponent,
  ProductMatrixComponentModule,
} from '../product-matrix/product-matrix.component';
import {
  ProductProductionShippingComponent,
  ProductProductionShippingComponentModule,
} from '../product-production-shipping/product-production-shipping.component';
import { ProductRelatedComponentModule } from '../product-related';
import { ProductRelatedComponent } from '../product-related/product-related.component';
import {
  ProductSafetyWarningsComponent,
  ProductSafetyWarningsComponentModule,
} from '../product-safety-warnings/product-safety-warnings.component';
import {
  ProductSpecialsComponent,
  ProductSpecialsComponentModule,
} from '../product-specials/product-specials.component';
import {
  ProductDetailComponent,
  ProductDetailComponentModule,
} from './product-detail.component';
const mockSupplier = {
  Id: 7730,
  Name: 'Graphco line',
  AsiNumber: '57956',
  Preferred: {
    Name: 'Gold',
  },
  Ratings: {
    OverAll: { Rating: 9, Companies: 41, Transactions: 247 },
    Quality: { Rating: 9, Companies: 36, Transactions: 206 },
    Communication: { Rating: 9, Companies: 35, Transactions: 202 },
    Delivery: { Rating: 9, Companies: 34, Transactions: 201 },
    ConflictResolution: {
      Rating: 8,
      Companies: 13,
      Transactions: 133,
    },
    Decoration: { Rating: 9, Companies: 34, Transactions: 201 },
  },
};

const specials = [
  {
    Code: 'code',
    CurrencyCode: 'CurrencyCode',
    DateDisplay: 'DateDisplay',
    Description: 'Description',
    Discount: 10,
    DiscountUnit: 'DiscountUnit',
    FromDate: 'FromDate',
    Id: 1,
    ImageUrl: 'ImageUrl',
    Name: 'Name',
    ThroughDate: '11/27/20',
    Type: 'Type',
    TypeCode: 'TypeCode',
    TypeDescription: 'TypeDescription',
  },
];

const supplier = SuppliersMockDb.suppliers[0];

describe('ProductDetailComponent', () => {
  let spectator: Spectator<ProductDetailComponent>;
  let product: Product;
  let inventory: any;
  let router: Router;
  const variants = [
    {
      Id: 845222076,
      Name: 'Red',
      Description: 'Product Color: Red',
      ImageUrl: 'media/91598709',
      Values: [
        {
          Id: 805099311,
          Name: 'Color',
          Description: 'Color',
          Code: 'PRCL',
          Values: [
            {
              Id: 838707282,
              Name: 'Red',
              Seq: 1,
            },
          ],
        },
      ],
      Attributes: {
        Colors: {
          Values: [
            {
              Code: 'MERD',
              Name: 'Red',
              ImageUrl: 'media/91598709',
              ProductNumber: 'PPP1',
            },
          ],
        },
      },
      Prices: [
        {
          Quantity: {
            From: 2,
            To: 2147483647,
          },
          Price: 11.0,
          Cost: 5.5,
          DiscountCode: 'P',
          CurrencyCode: 'USD',
          IsQUR: false,
        },
      ],
      PriceIncludes: 'CAN \u0026 US PRICING',
    },
    {
      Id: 845222077,
      Name: 'Bright Gold',
      Description: 'Product Color: Bright Gold',
      ImageUrl: 'media/40356582',
      Values: [
        {
          Id: 805099311,
          Name: 'Color',
          Description: 'Color',
          Code: 'PRCL',
          Values: [
            {
              Id: 838707281,
              Name: 'Bright Gold',
              Seq: 2,
            },
          ],
        },
      ],
      Attributes: {
        Colors: {
          Values: [
            {
              Code: 'DRYE',
              Name: 'Bright Gold',
              ImageUrl: 'media/40356582',
            },
          ],
        },
      },
      Prices: [
        {
          Quantity: {
            From: 1,
            To: 2147483647,
          },
          Price: 22.0,
          Cost: 16.5,
          DiscountCode: 'U',
          CurrencyCode: 'USD',
          IsQUR: false,
        },
      ],
      PriceIncludes: 'CAN PRICING2',
    },
  ];
  let component: ProductDetailComponent;
  let collectionsDialogService: CollectionsDialogService;
  let spyFn: jest.SpyInstance;

  const createComponent = createComponentFactory({
    component: ProductDetailComponent,
    declarations: [
      MockComponents(
        ProductImprintMethodsComponent,
        ProductInfoComponent,
        ProductInventoryComponent,
        ProductMatrixComponent,
        ProductProductionShippingComponent,
        ProductSafetyWarningsComponent,
        ProductSpecialsComponent
      ),
    ],
    imports: [
      RouterTestingModule.withRoutes([]),
      NgxsModule.forRoot(),

      ProductDetailComponentModule,
    ],
    providers: [
      mockProvider(AuthFacade),
      mockProvider(AuthServiceConfig),
      mockProvider(CollectionsDialogService),
      mockProvider(CosToastService),

      mockProvider(ProductsDialogService),
      mockProvider(AddToPresentationFlow),
    ],
    overrideModules: [
      [
        CosProductMediaModule,
        {
          set: {
            declarations: MockComponents(CosProductMediaComponent),
            exports: MockComponents(CosProductMediaComponent),
          },
        },
      ],
      [
        CosSupplierModule,
        {
          set: {
            declarations: MockComponents(
              CosSupplierComponent,
              CosSupplierFooterComponent
            ),
            exports: MockComponents(
              CosSupplierComponent,
              CosSupplierFooterComponent
            ),
          },
        },
      ],
      [
        CosProductVariantsModule,
        {
          set: {
            declarations: MockComponents(CosProductVariantsComponent),
            exports: MockComponents(CosProductVariantsComponent),
          },
        },
      ],
      [
        ProductImprintMethodsComponentModule,
        {
          set: {
            declarations: MockComponents(ProductImprintMethodsComponent),
            exports: MockComponents(ProductImprintMethodsComponent),
          },
        },
      ],
      [
        ProductInfoComponentModule,
        {
          set: {
            declarations: MockComponents(ProductInfoComponent),
            exports: MockComponents(ProductInfoComponent),
          },
        },
      ],
      [
        ProductProductionShippingComponentModule,
        {
          set: {
            declarations: MockComponents(ProductProductionShippingComponent),
            exports: MockComponents(ProductProductionShippingComponent),
          },
        },
      ],
      [
        ProductSafetyWarningsComponentModule,
        {
          set: {
            declarations: MockComponents(ProductSafetyWarningsComponent),
            exports: MockComponents(ProductSafetyWarningsComponent),
          },
        },
      ],
      [
        ProductSpecialsComponentModule,
        {
          set: {
            declarations: MockComponents(ProductSpecialsComponent),
            exports: MockComponents(ProductSpecialsComponent),
          },
        },
      ],
      [
        ProductMatrixComponentModule,
        {
          set: {
            declarations: MockComponents(ProductMatrixComponent),
            exports: MockComponents(ProductMatrixComponent),
          },
        },
      ],
      [
        ProductInventoryComponentModule,
        {
          set: {
            declarations: MockComponents(ProductInventoryComponent),
            exports: MockComponents(ProductInventoryComponent),
          },
        },
      ],
      [
        ProductRelatedComponentModule,
        {
          set: {
            declarations: MockComponents(ProductRelatedComponent),
            exports: MockComponents(ProductRelatedComponent),
          },
        },
      ],
    ],
  });

  beforeEach(() => {
    product = ProductsMockDb.products[0];
    inventory = mockInventory.ProductQuantities[0].Quantities;

    spectator = createComponent({
      props: {
        product,
        inventory,
        supplier,
      },
    });
    component = spectator.component;
    collectionsDialogService = spectator.inject(CollectionsDialogService);
    router = spectator.inject(Router);

    jest.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));
  });

  describe('Product Name', () => {
    it('should display correctly', () => {
      product = {
        ...product,
        Name: 'UL Listed Pebble Carabiner Power Bank With Custom Box',
      };

      spectator.setInput('product', product);
      spectator.detectChanges();
      expect(spectator.query('.product-title')).toHaveText(product.Name);
    });
    it('should display correctly with special characters and alphanumeric characters', () => {
      product.Name =
        'UL 12 Listed Pebble 99 Carabiner Power Bank With Custom Box @^&%()';
      spectator.detectComponentChanges();
      expect(spectator.query('.product-title')).toHaveText(product.Name);
    });
    it('should display correctly with long title text', () => {
      product.Name = `UL Listed Pebble Carabiner Power Bank With Custom Box
      UL Listed Pebble Carabiner Power Bank With Custom Box UL Listed Pebble
       Carabiner Power Bank With Custom BoxUL Listed Pebble Carabiner Power
        Bank With Custom BoxUL Listed Pebble Carabiner Power Bank With Custom
         BoxUL Listed Pebble Carabiner Power Bank With Custom BoxUL Listed
          Pebble Carabiner Power Bank With Custom BoxUL Listed Pebble
          Carabiner Power Bank With Custom BoxUL Listed Pebble Carabiner
          Power Bank With Custom BoxUL Listed Pebble Carabiner Power Bank With
           Custom BoxUL Listed Pebble Carabiner Power Bank With Custom Box`;
      spectator.detectComponentChanges();
      expect(spectator.query('.product-title')).toHaveText(product.Name);
    });
  });

  describe('Product Summary', () => {
    it('should display correctly', () => {
      product.ShortDescription =
        'UL Listed power bank with carabiner, 5000 mAh non-recycled battery, USB output, Micro USB input and white LED indicator lights.';
      spectator.detectComponentChanges();
      expect(spectator.query('.product-summary')).toHaveText(
        product.ShortDescription
      );
    });
    it('should display correctly with special characters and alphanumeric characters', () => {
      product.ShortDescription =
        'UL Listed power bank with carabiner, 5000 mAh non-recycled battery, USB output, 1244 Micro USB input 99 and white LED indicator lights. @^&%()';
      spectator.detectComponentChanges();
      expect(spectator.query('.product-summary')).toHaveText(
        product.ShortDescription
      );
    });
  });

  describe('Base Product Number', () => {
    it('should display correctly', () => {
      product.Number = 'ADB23';
      spectator.detectComponentChanges();
      expect(spectator.query('.product-number')).toHaveText(
        `Product #: ${product.Number}`
      );
    });
    it('should not display when empty', () => {
      product.Number = '';
      spectator.detectComponentChanges();
      expect(spectator.query('.product-number')).not.toExist();
    });
    it('should display correctly with special characters and alphanumeric characters', () => {
      product.Number = 'ADB23@123$%&';
      spectator.detectComponentChanges();
      expect(spectator.query('.product-number')).toHaveText(
        `Product #: ${product.Number}`
      );
    });
    it('should display with larger text', () => {
      product.Number = `ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23
      ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB
      23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23A
      DB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB2
      3ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23ADB23AD
      B23ADB23ADB23ADB23ADB23ADB23`;
      spectator.detectComponentChanges();
      expect(spectator.query('.product-number')).toHaveText(
        `Product #: ${product.Number}`
      );
    });
  });

  describe('Product CPN', () => {
    it('should display correctly', () => {
      // TODO: Need to mock authFacade
      product.Id = 553216704;
      spectator.detectChanges();

      const htmlElelement = spectator.query('.product-cpn');
      // expect(host.query('.product-cpn')).toHaveText(
      //   `CPN-${product.Id}`
      // );
    });
    it('should not display when empty', () => {
      // TODO: Add code to handle this test
      product.Id = null;
      spectator.detectChanges();
      // expect(host.query('.product-cpn')).not.toExist();
    });
  });

  describe('Product Tags', () => {
    describe('Data Fresh', () => {
      it('should display correctly when product is new', () => {
        product.UpdateDate = new Date().toString();
        product.IsNew = true;
        spectator.detectComponentChanges();
        const productUpdateTags = spectator.queryAll('.product-updates-tags');
        expect(productUpdateTags.length).toEqual(2);
        expect(productUpdateTags[0]).toContainText('New Product');
        expect(productUpdateTags[1]).toContainText('Data Fresh');
      });
      it('should display correctly when product is not new', () => {
        product.UpdateDate = new Date().toString();
        product.IsNew = false;
        spectator.detectComponentChanges();
        const productUpdateTags = spectator.queryAll('.product-updates-tags');
        expect(productUpdateTags.length).toEqual(1);
        expect(productUpdateTags[0]).toContainText('Data Fresh');
      });
      it('should not display when the product is older than 30 days', () => {
        product.UpdateDate = new Date(2020, 1, 1, 12, 0, 0, 0).toString();
        product.IsNew = false;
        spectator.detectComponentChanges();
        const productUpdateTags = spectator.queryAll('.product-updates-tags');
        expect(productUpdateTags.length).toEqual(0);
      });
    });
    describe('New Product', () => {
      it('should display correctly when product is new', () => {
        product.UpdateDate = new Date(2020, 1, 1, 12, 0, 0, 0).toString();
        product.IsNew = true;
        spectator.detectComponentChanges();
        const productUpdateTags = spectator.queryAll('.product-updates-tags');
        expect(productUpdateTags.length).toEqual(1);
        expect(productUpdateTags[0]).toContainText('New Product');
      });
      it('should not display when the product is older than 30 days', () => {
        product.UpdateDate = new Date(2020, 1, 1, 12, 0, 0, 0).toString();
        product.IsNew = false;
        spectator.detectComponentChanges();
        const productUpdateTags = spectator.queryAll('.product-updates-tags');
        expect(productUpdateTags.length).toEqual(0);
      });
    });
    describe('Made in USA', () => {
      it('should display correctly', () => {
        product.Origin = ['USA'];
        spectator.detectComponentChanges();
        const productFeatureTags = spectator.queryAll('.product-features-tags');
        expect(productFeatureTags.length).toBeGreaterThan(0);
        expect(productFeatureTags[0]).toContainText('Made in USA');
      });
      it('should display correctly when multiple countries when USA also in list of countries', () => {
        product.Origin = ['USA', 'CANADA'];
        spectator.detectComponentChanges();
        const productFeatureTags = spectator.queryAll('.product-features-tags');
        expect(productFeatureTags.length).toBeGreaterThan(0);
        expect(productFeatureTags[0]).toContainText('Made in USA');
      });
      it('should not display when USA not in list of countries', () => {
        product.Origin = ['CANADA'];
        product.HasRushService = false;
        spectator.detectComponentChanges();
        const productFeatureTags = spectator.queryAll('.product-features-tags');
        expect(productFeatureTags.length).toEqual(0);
      });
      it('should not display when no countries are specified', () => {
        product.Origin = null;
        product.HasRushService = false;
        spectator.detectComponentChanges();
        const productFeatureTags = spectator.queryAll('.product-features-tags');
        expect(productFeatureTags.length).toEqual(0);
      });
    });
    describe('Rush Service', () => {
      it('should display correctly', () => {
        product.HasRushService = true;
        product.Origin = [];
        spectator.detectComponentChanges();
        const productFeatureTags = spectator.queryAll('.product-features-tags');
        expect(productFeatureTags.length).toEqual(1);
        expect(productFeatureTags[0]).toContainText('Rush Service available');
      });
      it('should not display when rush service not selected', () => {
        product.HasRushService = false;
        product.IsNew = false;
        product.Origin = [];
        spectator.detectComponentChanges();
        const productFeatureTags = spectator.queryAll('.product-features-tags');
        expect(productFeatureTags.length).toEqual(0);
      });
    });

    describe('Order', () => {
      beforeEach(() => {
        product.UpdateDate = new Date(2020, 1, 1, 12, 0, 0, 0).toString();
        product.HasRushService = true;
      });
      it('Specials, Made in USA, Rush Service', () => {
        product.Origin = ['Canada'];
        product.Specials = [specials[0]];
        product.IsNew = true;
        spectator.detectComponentChanges();
        const updateTags = spectator.queryAll('.product-updates-tags');
        expect(updateTags.length).toEqual(2);
        expect(updateTags[0].textContent).toContain('New Product');
        expect(updateTags[1].textContent).toContain(specials[0].Type);
        const featureTags = spectator.queryAll('.product-features-tags');
        expect(featureTags.length).toEqual(1);
        expect(featureTags[0].textContent).toContain('Rush Service available');
      });

      it('Made in USA, Rush Service with specials', () => {
        product.Origin = ['USA'];
        product.Specials = [specials[0]];
        product.IsNew = false;
        spectator.detectComponentChanges();
        const updateTags = spectator.queryAll('.product-updates-tags');
        expect(updateTags.length).toEqual(1);
        const featureTags = spectator.queryAll('.product-features-tags');
        expect(featureTags.length).toEqual(2);
        expect(featureTags[0].textContent).toContain('Made in USA');
        expect(featureTags[1].textContent).toContain('Rush Service available');
      });

      it('Made in USA, Rush Service without specials', () => {
        product.Origin = ['USA'];
        product.Specials = [];
        product.IsNew = false;
        spectator.detectComponentChanges();
        const updateTags = spectator.queryAll('.product-updates-tags');
        expect(updateTags.length).toEqual(0);
        const featureTags = spectator.queryAll('.product-features-tags');
        expect(featureTags.length).toEqual(2);
        expect(featureTags[0].textContent).toContain('Made in USA');
        expect(featureTags[1].textContent).toContain('Rush Service available');
      });

      it('Rush Service  available', () => {
        product.Origin = ['Canada'];
        product.Specials = [];
        product.IsNew = false;
        spectator.detectComponentChanges();
        const updateTags = spectator.queryAll('.product-updates-tags');
        expect(updateTags.length).toEqual(0);
        const featureTags = spectator.queryAll('.product-features-tags');
        expect(featureTags.length).toEqual(1);
        expect(featureTags[0].textContent).toContain('Rush Service available');
      });
    });
  });

  it('should display product price range', () => {
    const pipe = new FormatPriceRangePipe();
    const expectedResult = pipe.transform(product);
    expect(spectator.query('.product-price-range')).toHaveText(expectedResult);
  });

  it('should display product currency code', () => {
    const priceVariants = [{ Prices: product.Prices }];
    expect(spectator.query('.product-currency-code')).toHaveText(
      priceVariants[0].Prices[0].CurrencyCode
    );
  });

  it('should show supplier by rendering the cosmos supplier component', () => {
    spectator.setInput('supplier', mockSupplier);
    spectator.detectChanges();
    const costSupplierElement = spectator.query('cos-supplier');
    expect(costSupplierElement).toExist();
    expect(costSupplierElement).toHaveClass('supplier-card');
    /*
    expect(costSupplierElement).toHaveAttribute(
      'ng-reflect-show-image',
      'true'
    );
    expect(costSupplierElement).toHaveAttribute(
      'ng-reflect-show-details',
      'true'
    );
    */
  });

  it('should not show product colors if it do not exist', () => {
    product.Attributes.Colors.Values = null;
    spectator.detectComponentChanges();
    expect('.product-attribute-colors > cos-product-variants').not.toExist();
  });

  it('Specials section should not be displayed', () => {
    product.Specials = [];
    spectator.detectComponentChanges();
    expect(spectator.query('.product-specials')).toBeFalsy();
  });

  it('should show product colors by rendering the cos-product-variants component with correct attributes', () => {
    const cosProductVariantsElement = spectator.query(
      '.product-attribute-colors > cos-product-variants'
    );
    const colorVariants = {
      options: product.Attributes.Colors.Values,
    };
    expect(cosProductVariantsElement).toExist();
    expect(cosProductVariantsElement).toHaveAttribute(
      'ng-reflect-variant',
      `${colorVariants}`
    );
    expect(cosProductVariantsElement).toHaveAttribute(
      'ng-reflect-has-images',
      'true'
    );
  });

  it("for colors should not display 'Show more' button, when less than or equal to 12", () => {
    component.isShowMoreColorsEnabled = false;
    spectator.detectChanges();
    const showMoreLessBtn = spectator.query(
      '.product-attribute-colors > div > button'
    );
    expect(showMoreLessBtn).toBeFalsy();
  });

  it("for colors should display 'Show less' button text, when 'Show more' button is clicked", () => {
    component.isShowMoreColorsEnabled = true;
    spectator.detectComponentChanges();
    const showMoreLessBtn = spectator.query(
      '.product-attribute-colors > div > button'
    );
    expect(showMoreLessBtn).toBeVisible();
    expect(showMoreLessBtn).toHaveText('Show more');
    component.toggleColorLimit();
    expect(component.showingAllColors).toBeTruthy();
    expect(component.visibleColors).toEqual(
      product.Attributes.Colors.Values.length
    );
  });

  it('should not show product sizes if it do not exist', () => {
    product.Attributes.Sizes.Values = null;
    spectator.detectComponentChanges();
    expect(
      spectator.query('.product-attribute-sizes > cos-product-variants')
    ).not.toExist();
  });

  it('should show product sizes by rendering the cos-product-variants component with correct attributes', () => {
    const cosProductVariantsElement = spectator.query(
      '.product-attribute-sizes > cos-product-variants'
    );
    const sizeVariants = {
      options: product.Attributes.Sizes.Values,
    };
    expect(cosProductVariantsElement).toExist();
    expect(cosProductVariantsElement).toHaveAttribute(
      'ng-reflect-variant',
      `${sizeVariants}`
    );
    expect(cosProductVariantsElement).toHaveAttribute(
      'ng-reflect-has-images',
      'false'
    );
  });

  it('should not show product Imprint methods if it do not exist', () => {
    product.Imprinting.Methods.Values = null;
    spectator.detectComponentChanges();
    expect(
      spectator.query(
        '.product-attribute-imprint-methods > cos-product-variants'
      )
    ).not.toExist();
  });

  it('should show product sizes by rendering the cos-product-variants component with correct attributes', () => {
    const cosProductVariantsElement = spectator.query(
      '.product-attribute-imprint-methods > cos-product-variants'
    );
    const imprintVariants = {
      options: product.Imprinting.Methods.Values,
    };
    expect(cosProductVariantsElement).toExist();
    expect(cosProductVariantsElement).toHaveAttribute(
      'ng-reflect-variant',
      `${imprintVariants}`
    );
    expect(cosProductVariantsElement).toHaveAttribute(
      'ng-reflect-has-images',
      'false'
    );
  });

  it('should not expand Imprint Information Accordion by default', () => {
    expect(component.imprintAccordionExpanded).toBeFalsy();
  });

  it('should not expand Product Information Accordion by default', () => {
    expect(component.productInfoAccordionExpanded).toBeFalsy();
  });

  it('should not expand Production and shipping Accordion by default', () => {
    expect(component.productionShippingAccordionExpanded).toBeFalsy();
  });

  it('should not expand Safety warnings Accordion by default', () => {
    expect(component.safetyWarningsAccordionExpanded).toBeFalsy();
  });

  it('should not display inventory', () => {
    product.HasInventory = false;
    spectator.detectChanges();
    expect(spectator.query('.inventory-section')).not.toBeVisible();
  });

  it('should not display inventory if HasInventory is true and inventory is null', () => {
    product.HasInventory = true;
    spectator.setInput('inventory', null);
    spectator.detectChanges();
    expect(spectator.query('.inventory-section')).not.toBeVisible();
  });

  it('should display inventory and view inventory link', () => {
    product.HasInventory = true;
    spectator.detectComponentChanges();
    expect(spectator.query('.inventory-section')).toBeVisible();
    expect(spectator.query('.view-all-inventory-link')).toBeVisible();
    expect(spectator.query('.view-all-inventory-link').textContent).toContain(
      'View Inventory Grids'
    );
  });

  it('should not display view inventory link', () => {
    product.HasInventory = true;
    spectator.component.inventory = [];
    spectator.detectComponentChanges();
    expect(spectator.query('.view-all-inventory-link')).not.toBeVisible();
  });

  describe('Confirmed Through date', () => {
    it('should display product confirmed through date', () => {
      product.ConfirmThroughDate = '2020-12-31T05:00:00.000Z';
      spectator.detectComponentChanges();
      expect(
        spectator.query('.product-confirmed-through-date-text')
      ).toHaveText(`All prices confirmed through 12/31/2020`);
    });
    it('should not display when not present', () => {
      product.ConfirmThroughDate = undefined;
      spectator.detectComponentChanges();
      expect(
        spectator.query('.product-confirmed-through-date-text')
      ).not.toBeVisible();
    });
  });

  describe('Pricing', () => {
    describe('Multiple Price Grid', () => {
      it('Should see View All Price Grids ', () => {
        product.Variants = [...variants];
        spectator.detectComponentChanges();
        expect(spectator.query('.view-all-price-grids')).toBeTruthy();
      });
    });
  });

  describe('Prop65 warnings', () => {
    it('should not show product Warning if Prop65 warning do not exist', () => {
      product.HasProp65Warning = false;
      spectator.detectComponentChanges();
      expect(spectator.query('.product-warning')).not.toExist();
    });

    it('should show Prop65 product Warning with no description', () => {
      product.HasProp65Warning = true;
      product.Warnings = [
        {
          Name: 'Product can cause exposure to both a carcinogen and a reproductive toxicant',
          Description: '',
          Warning:
            'Product can cause exposure to both a carcinogen and a reproductive toxicant',
          Type: 'PROP',
        },
      ];
      spectator.detectComponentChanges();
      expect(spectator.query('.product-warning')).toExist();
    });

    it('should show Prop65 product Warning with description', () => {
      product.HasProp65Warning = true;
      product.Warnings = [
        {
          Name: 'Product can cause exposure to both a carcinogen and a reproductive toxicant',
          Description: 'This product can expose you to chemicals like Lead',
          Warning:
            'Product can cause exposure to both a carcinogen and a reproductive toxicant',
          Type: 'PROP',
        },
      ];
      spectator.detectComponentChanges();
      expect(spectator.query('.product-warning')).toExist();
      expect(spectator.query('.product-warning').innerHTML.trim()).toContain(
        product.Warnings[0].Description
      );
    });

    it('should show multiple Prop65 product Warning with description', () => {
      product.HasProp65Warning = true;
      product.Warnings = [
        {
          Name: 'Product can cause exposure to both a carcinogen and a reproductive toxicant',
          Description: 'This product can expose you to chemicals like Lead',
          Warning:
            'Product can cause exposure to both a carcinogen and a reproductive toxicant',
          Type: 'PROP',
        },
        {
          Name: 'Product can cause exposure to both a carcinogen and a reproductive toxicant',
          Description: 'This product can expose you to chemicals like Lead',
          Warning:
            'Product can cause exposure to both a carcinogen and a reproductive toxicant',
          Type: 'PROP',
        },
      ];
      spectator.detectComponentChanges();
      expect(spectator.query('.product-warning')).toExist();
      expect(
        spectator.queryAll('.product-warning')[0].innerHTML.trim()
      ).toContain(product.Warnings[0].Description);
      expect(
        spectator.queryAll('.product-warning')[1].innerHTML.trim()
      ).toContain(product.Warnings[1].Description);
    });
  });
  describe('Add To Collection', () => {
    beforeEach(() => {
      spyFn = jest
        .spyOn(collectionsDialogService, 'addToCollection')
        .mockReturnValue(
          of({
            Collection: { Name: 'some result' },
            ProductsDuplicated: [],
            ProductsTruncated: [],
          })
        );
    });
    it("'Add to Collection' option should be available on the product detail page", () => {
      const button = spectator.query('.add-to-collection-btn');
      expect(button).toExist();
    });
    it("Clicking 'Add to Collection' option should take user to the Add to collection modal when there are multiple existing collections and user has edit rights for all of collections.", () => {
      component.addToCollection();
      expect(spyFn).toHaveBeenCalled();
    });

    it('User should be redirected back to the product detail page when user selects and adds a product to a collection successfully.', () => {
      component.addToCollection();
      expect(spyFn).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('Click on supplier link should navigate to supplier detail', () => {
      component.supplierDetail(supplier);
      expect(router.navigate).toHaveBeenCalledWith(
        ['/suppliers', supplier.Id],
        { state: { navigationName: 'Back' } }
      );
    });

    it('Product Image selected on the product detail page should be the one added to the collection when product has single image.', () => {
      const mockProduct = Object.assign({}, product);
      const imageUrls = Array(1).fill(faker.image.avatar());
      mockProduct.Images = imageUrls;
      component.product = mockProduct;
      component.productMedia = component.getProductMedia();
      component.imageSelected(0);
      spectator.detectChanges();
      component.addToCollection();
      expect(spyFn).toHaveBeenCalled();
      expect(spyFn).toHaveBeenCalledWith([
        productToCollectionProduct({
          ...mockProduct,
          ImageUrl: mockProduct.Images[0],
        }),
      ]);
    });

    it('Product Image selected on the product detail page should be the one added to the collection when product has multiple image and default image is selected at product detail page.', () => {
      const mockProduct = product;
      const imageUrls = Array(1).fill(faker.image.avatar());
      mockProduct.Images = imageUrls;
      component.product = mockProduct;
      component.productMedia = component.getProductMedia();
      spectator.detectChanges();
      component.addToCollection();
      expect(spyFn).toHaveBeenCalled();
      expect(spyFn).toHaveBeenCalledWith([
        productToCollectionProduct({
          ...mockProduct,
          ImageUrl: mockProduct.Images[0],
        }),
      ]);
    });

    it('Product Image selected on the product detail page should be the one added to the collection when product has multiple image and non default image is selected at product detail page.', () => {
      const mockProduct = product;
      const imageUrls = Array(4).fill(faker.image.avatar());
      mockProduct.Images = imageUrls;
      component.product = mockProduct;
      component.productMedia = component.getProductMedia();
      component.imageSelected(2);
      spectator.detectChanges();
      component.addToCollection();
      expect(spyFn).toHaveBeenCalled();
      expect(spyFn).toHaveBeenCalledWith([
        productToCollectionProduct({
          ...mockProduct,
          ImageUrl: mockProduct.Images[2],
        }),
      ]);
    });
  });

  it('should start create presentation flow with checked products', () => {
    const flow = spectator.inject(AddToPresentationFlow, true);
    const flowSpy = jest.spyOn(flow, 'start');

    component.addToPresentation();
    expect(flowSpy).toHaveBeenCalledWith({
      checkedProducts: expect.any(Map),
    });
  });
});
