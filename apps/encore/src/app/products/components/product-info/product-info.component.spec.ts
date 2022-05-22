import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { Product } from '@smartlink/models';
import { ProductsMockDb } from '@smartlink/products/mocks';
import { EvalDisplayValuePipe, FormatArrayListPipe } from '@smartlink/products';
import { MockComponent } from 'ng-mocks';
import { ProductChargesTableComponent } from '../product-charges-table/product-charges-table.component';
import {
  ProductInfoComponent,
  ProductInfoComponentModule,
} from './product-info.component';

const charges = [
  {
    TypeCode: 'STCH',
    Type: 'Set-up Charge',
    Description: 'Emblem, Red',
    Prices: [
      {
        Quantity: {
          From: 25,
          To: 2147483647,
          $index: 1,
        },
        Price: 21,
        Cost: 21,
        DiscountCode: 'Z',
        CurrencyCode: 'USD',
        IsQUR: false,
      },
    ],
    PriceIncludes: 'Upcharge details for Embelem and red',
    IsRequired: true,
  },
  {
    TypeCode: 'TGCH',
    Type: 'Tooling Charge',
    Description: 'Emblem, Red',
    Prices: [
      {
        Quantity: {
          From: 30,
          To: 2147483647,
          $index: 1,
        },
        Price: 11,
        Cost: 11,
        DiscountCode: 'Z',
        CurrencyCode: 'USD',
        IsQUR: false,
      },
    ],
    PriceIncludes: 'Upcharge details for Embelem and red',
    IsRequired: false,
  },
];

describe('ProductInfoComponent', () => {
  let spectator: Spectator<ProductInfoComponent>;
  let product: Product;

  const createComponent = createComponentFactory({
    component: ProductInfoComponent,
    imports: [ProductInfoComponentModule],
    declarations: [MockComponent(ProductChargesTableComponent)],
  });

  beforeEach(() => {
    product = ProductsMockDb.products[0];
    spectator = createComponent({
      props: {
        product,
      },
    });
  });

  describe('Product description', () => {
    it('should not be shown if description does not exist', () => {
      product.Description = '';
      spectator.detectChanges();
      expect(spectator.query('.product-description')).not.toExist();
    });

    it('should verify correct product description', () => {
      product.Description = 'This is a description.';
      spectator.detectChanges();
      expect(spectator.query('.product-description')).toHaveExactText(
        product.Description
      );
    });

    it('should verify correct product description with maximum characters', () => {
      product.Description =
        'This is a loonnggg description.This is a loonnggg description.This is a loonnggg description.This is a loonnggg description.This is a loonnggg description.This is a loonnggg description.This is a loonnggg description.This is a loonnggg description.This is a loonnggg description.This is a loonnggg description.This is a loonnggg description.This is a loonnggg description.This is a loonnggg description.This is a loonnggg description.This is a loonnggg description.This is a loonnggg description.This is a loonnggg description.This is a loonnggg description.This is a loonnggg description.';
      spectator.detectChanges();
      expect(spectator.query('.product-description')).toHaveExactText(
        product.Description
      );
    });
  });

  describe('Product Distributor comments', () => {
    it('should not be shown if it does not exist', () => {
      product.DistributorComments = '';
      spectator.detectChanges();
      expect(spectator.query('.product-distributor-comments')).not.toExist();
    });

    it('should verify the correct distributor comment', () => {
      product.DistributorComments =
        'Embroidery Only - Digitizing Minimum charge of $40 (Z)';
      spectator.detectChanges();
      expect(spectator.query('.product-distributor-comments')).toHaveText(
        product.DistributorComments
      );
    });
  });

  describe("Product's Additional information", () => {
    it('should not be shown if it does not exist', () => {
      product.AdditionalInfo = '';
      spectator.detectChanges();
      expect(spectator.query('.product-additional-info')).not.toExist();
    });

    it('should verify correct information', () => {
      product.AdditionalInfo = 'Minimum Order - 12 pieces blank';
      spectator.detectChanges();
      expect(spectator.query('.product-additional-info')).toHaveExactText(
        product.AdditionalInfo
      );
    });
  });

  describe('Product categories', () => {
    it('should not be shown if it does not exist', () => {
      product.Categories = null;
      spectator.detectChanges();
      expect(spectator.query('.product-categories')).not.toExist();
    });

    it('should verify correct categories of a product with single category', () => {
      product.Categories = [
        {
          Id: 'B02220003',
          Name: 'Six Panel',
          Parent: {
            Id: 'B02160003',
            Name: 'Baseball Caps',
          },
        },
      ];
      spectator.detectChanges();
      const len = product.Categories.length;
      expect(spectator.queryAll('.product-categories').length).toEqual(len);
      product.Categories.forEach((category) => {
        expect(spectator.queryAll('.product-categories')).toHaveText(
          category.Parent.Name
        );
      });
    });

    it('should verify correct categories of a product with multiple categories', () => {
      const len = product.Categories.length;
      expect(spectator.queryAll('.product-categories').length).toEqual(len);
      product.Categories.forEach((category) => {
        expect(spectator.queryAll('.product-categories')).toHaveText(
          category.Parent.Name
        );
      });
    });
  });

  describe('Product themes', () => {
    it('should not be shown if it does not exist', () => {
      product.Themes = null;
      spectator.detectChanges();
      expect(spectator.query('.product-themes')).not.toExist();
    });

    it('should verify correct themes of the product with single themes', () => {
      const themeArray = ['Sports'];
      const pipe = new FormatArrayListPipe();
      const themes = pipe.transform(themeArray, ', ');
      product.Themes = themeArray;
      spectator.detectChanges();
      expect(spectator.query('.product-themes')).toHaveExactText(` ${themes} `);
    });

    it('should verify correct themes of the product with multiple themes', () => {
      const themeArray = ['Sports', 'Golf', 'Baseball'];
      const pipe = new FormatArrayListPipe();
      const themes = pipe.transform(themeArray, ', ');
      product.Themes = themeArray;
      spectator.detectChanges();
      expect(spectator.query('.product-themes')).toHaveExactText(` ${themes} `);
    });
  });

  describe('Product colors', () => {
    it('should not be shown if it does not exist', () => {
      product.Attributes = null;
      spectator.detectChanges();
      expect(spectator.query('.product-colors')).not.toExist();
    });

    it('should verify correct colors of the product with single color', () => {
      product.Attributes.Colors = {
        Values: [
          {
            Code: 'BLCK',
            Name: 'Black 003',
            ImageUrl: 'media/29022724',
            Options: [],
            Charges: [...charges],
          },
        ],
      };
      spectator.detectChanges();
      expect(spectator.query('.color-product-charges-header')).toHaveText(
        'Black 003'
      );
      const pipe = new FormatArrayListPipe();
      const colors = pipe.transform(
        product.Attributes.Colors.Values,
        ', ',
        'Name'
      );
      expect(spectator.query('.product-colors')).toHaveExactText(` ${colors} `);
    });

    it('should verify correct colors of the product with multiple colors', () => {
      product.Attributes.Colors = {
        Values: [
          {
            Code: 'BLCK',
            Name: 'Black 003',
            ImageUrl: 'media/29022724',
            Options: [],
          },
          {
            Code: 'BLCK1',
            Name: 'Black 004',
            ImageUrl: 'media/29022724',
            Options: [],
            Charges: [...charges],
          },
        ],
      };
      spectator.detectChanges();
      const pipe = new FormatArrayListPipe();
      const colors = pipe.transform(
        product.Attributes.Colors.Values,
        ', ',
        'Name'
      );
      expect(spectator.query('.color-product-charges-header')).toHaveText(
        'Black 004'
      );
      expect(spectator.query('.product-colors')).toHaveExactText(` ${colors} `);
    });
  });

  describe('Product sizes', () => {
    it('should not be shown if it does not exist', () => {
      product.Attributes = null;
      spectator.detectChanges();
      expect(spectator.query('.product-sizes')).not.toExist();
    });

    it('should verify correct sizes of the product with single size', () => {
      product.Attributes.Sizes = {
        Values: [
          {
            Code: 'OTHE',
            Name: 'Standard',
            Options: [],
            Charges: [...charges],
          },
        ],
      };
      spectator.detectChanges();
      const pipe = new FormatArrayListPipe();
      const sizes = pipe.transform(
        product.Attributes.Sizes.Values,
        ', ',
        'Name'
      );
      expect(spectator.query('.size-product-charges-header')).toHaveText(
        'Standard'
      );
      expect(spectator.query('.product-sizes')).toHaveExactText(` ${sizes} `);
    });

    it('should verify correct sizes of the product with multiple size', () => {
      product.Attributes.Sizes = {
        Values: [
          {
            Code: 'OTHE',
            Name: 'Standard',
            Options: [],
          },
          {
            Code: 'OTHE',
            Name: 'General',
            Options: [],
            Charges: [...charges],
          },
        ],
      };
      spectator.detectChanges();
      const pipe = new FormatArrayListPipe();
      const sizes = pipe.transform(
        product.Attributes.Sizes.Values,
        ', ',
        'Name'
      );
      expect(spectator.query('.size-product-charges-header')).toHaveText(
        'General'
      );
      expect(spectator.query('.product-sizes')).toHaveExactText(` ${sizes} `);
    });
  });

  describe('Product shapes', () => {
    it('should not be shown if it does not exist', () => {
      product.Attributes = null;
      spectator.detectChanges();
      expect(spectator.query('.product-shapes')).not.toExist();
    });

    it('should show correct shape for product with single shape', () => {
      const pipe = new FormatArrayListPipe();
      product.Attributes.Shapes = {
        Values: [
          {
            Code: '$026',
            Name: 'Round',
            Options: [],
            Charges: [...charges],
          },
        ],
      };
      spectator.detectChanges();
      const shapes = pipe.transform(
        product.Attributes.Shapes.Values,
        ', ',
        'Name'
      );
      expect(spectator.query('.shape-product-charges-header')).toHaveText(
        'Round'
      );
      expect(spectator.query('.product-shapes')).toHaveText(shapes);
    });

    it('should show correct shape for product with multiple shape', () => {
      const pipe = new FormatArrayListPipe();
      product.Attributes.Shapes = {
        Values: [
          {
            Code: '$026',
            Name: 'Round',
            Options: [],
          },
          {
            Code: '$026',
            Name: 'Square',
            Options: [],
            Charges: [...charges],
          },
        ],
      };
      spectator.detectChanges();
      const shapes = pipe.transform(
        product.Attributes.Shapes.Values,
        ', ',
        'Name'
      );
      expect(spectator.query('.shape-product-charges-header')).toHaveText(
        'Square'
      );
      expect(spectator.query('.product-shapes')).toHaveText(shapes);
    });
  });

  describe('Product materials', () => {
    it('should not be shown if it does not exist', () => {
      product.Attributes = null;
      spectator.detectChanges();
      expect(spectator.query('.product-materials')).not.toExist();
    });

    it('should verify correct materials of a product with single material', () => {
      product.Attributes.Materials = {
        Values: [
          {
            Code: '$026',
            Name: 'Cotton',
            Options: [],
            Charges: [...charges],
          },
        ],
      };
      spectator.detectChanges();
      const pipe = new FormatArrayListPipe();
      const materials = pipe.transform(
        product.Attributes.Materials.Values,
        ', ',
        'Name'
      );
      expect(spectator.query('.material-product-charges-header')).toHaveText(
        'Cotton'
      );
      expect(spectator.query('.product-materials')).toHaveExactText(
        ` ${materials} `
      );
    });

    it('should verify correct materials of a product with multiple materials', () => {
      product.Attributes.Materials = {
        Values: [
          {
            Code: '$026',
            Name: 'Cotton',
            Options: [],
          },
          {
            Code: '$026',
            Name: 'Silk',
            Options: [],
            Charges: [...charges],
          },
        ],
      };
      spectator.detectChanges();
      const pipe = new FormatArrayListPipe();
      const materials = pipe.transform(
        product.Attributes.Materials.Values,
        ', ',
        'Name'
      );
      expect(spectator.query('.material-product-charges-header')).toHaveText(
        'Silk'
      );
      expect(spectator.query('.product-materials')).toHaveExactText(
        ` ${materials} `
      );
    });
  });

  describe('Product weights', () => {
    it('should not be shown if it does not exist', () => {
      product.Weight = null;
      spectator.detectChanges();
      expect(spectator.query('.product-weights')).not.toExist();
    });

    it('should verify multiple weights', () => {
      const pipe = new FormatArrayListPipe();
      const expectedResult = pipe.transform(product.Weight.Values, ', ');
      expect(spectator.queryAll('.product-weights')).toHaveExactText(
        ` ${expectedResult} `
      );
    });

    it('should verify single weights', () => {
      product.Weight.Values = ['1mg'];
      spectator.detectChanges();
      const pipe = new FormatArrayListPipe();
      const expectedResult = pipe.transform(product.Weight.Values, ', ');
      expect(spectator.queryAll('.product-weights')).toHaveExactText(
        ` ${expectedResult} `
      );
    });
  });

  describe('Product Trade Names', () => {
    it('should not be shown if it does not exist', () => {
      product.TradeNames = null;
      spectator.detectChanges();
      expect(spectator.query('.product-trade-names')).not.toExist();
    });

    it('should verify Trade names', () => {
      const pipe = new FormatArrayListPipe();
      const expectedResult = pipe.transform(product.TradeNames, ', ');
      expect(spectator.queryAll('.product-trade-names')).toHaveExactText(
        ` ${expectedResult} `
      );
    });
  });

  describe('Product Line Names', () => {
    it('should not be shown if it does not exist', () => {
      product.LineNames = null;
      spectator.detectChanges();
      expect(spectator.query('.product-line-names')).not.toExist();
    });

    it('should verify Line names of a product with single line name', () => {
      product.LineNames = ['Line Name 1'];
      spectator.detectChanges();
      const pipe = new FormatArrayListPipe();
      const expectedResult = pipe.transform(product.LineNames, ', ');
      expect(spectator.queryAll('.product-line-names')).toHaveExactText(
        ` ${expectedResult} `
      );
    });

    it('should verify Line names of a product with multiple line name', () => {
      product.LineNames = ['Line Name 1', 'Line Name 2', 'Line name 3'];
      spectator.detectChanges();
      const pipe = new FormatArrayListPipe();
      const expectedResult = pipe.transform(product.LineNames, ', ');
      expect(spectator.queryAll('.product-line-names')).toHaveExactText(
        ` ${expectedResult} `
      );
    });
  });

  describe('Product Assembly', () => {
    it("should be displayed with 'No' value when not selected", () => {
      const pipe = new EvalDisplayValuePipe();
      product.IsAssembled = false;
      spectator.detectChanges();
      const expectedResult = pipe.transform(
        product.IsAssembled,
        'Yes',
        'No',
        'Unspecified'
      );
      expect(spectator.query('.product-require-assembly')).toHaveExactText(
        ` ${expectedResult} `
      );
    });

    it("should be displayed with 'Yes' value when not selected", () => {
      const pipe = new EvalDisplayValuePipe();
      product.IsAssembled = true;
      spectator.detectChanges();
      const expectedResult = pipe.transform(
        product.IsAssembled,
        'Yes',
        'No',
        'Unspecified'
      );
      expect(spectator.query('.product-require-assembly')).toHaveExactText(
        ` ${expectedResult} `
      );
    });

    it('should verify if products requires assembly', () => {
      const pipe = new EvalDisplayValuePipe();
      product.IsAssembled = null;
      const expectedResult = pipe.transform(
        product.IsAssembled,
        'Yes',
        'No',
        'Unspecified'
      );
      expect(spectator.query('.product-require-assembly')).toHaveExactText(
        ` ${expectedResult} `
      );
    });
  });

  describe('Product options', () => {
    it('should not be displayed', () => {
      product.Options = null;
      spectator.detectChanges();
      expect(spectator.query('product-option-name')).toBeFalsy();
    });
  });

  describe('Product Warranty Information', () => {
    it('should not show if it does not exist', () => {
      product.WarrantyInfo = null;
      spectator.detectChanges();
      expect(spectator.query('.product-warranty-name')).not.toExist();
    });

    it('should verify correct warranty informations', () => {
      const len = product.WarrantyInfo.Values.length;
      expect(spectator.queryAll('.product-warranty-name').length).toEqual(len);
      product.WarrantyInfo.Values.forEach((warrantyInfo) => {
        expect(spectator.queryAll('.product-warranty-name')).toHaveText(
          warrantyInfo.Name
        );
        expect(spectator.queryAll('.product-warranty-description')).toHaveText(
          warrantyInfo.Description
        );
      });
    });

    it('Should display Length, Labour, Parts, and Type', () => {
      product.WarrantyInfo = {
        Values: [
          {
            Name: 'Warranty Available',
          },
          {
            Name: 'Warranty Length',
            Description: '20 X 20',
          },
          {
            Name: 'Warranty Labor',
          },
          {
            Name: 'Warranty Parts',
          },
          {
            Name: 'Warranty Type',
            Description: 'Metallic to be placed open',
          },
          {
            Name: 'Additional warrenty type',
          },
          {
            Name: 'Additional warrenty type 2',
          },
        ],
      };
      spectator.detectChanges();
      const warrentyNames = spectator.queryAll('.product-warranty-name');
      const warrentyDescriptions = spectator.queryAll(
        '.product-warranty-description'
      );
      expect(warrentyNames[0]).toHaveText(product.WarrantyInfo.Values[0].Name);
      expect(warrentyNames[1]).toHaveText(product.WarrantyInfo.Values[1].Name);
      expect(warrentyDescriptions[1]).toHaveText(
        product.WarrantyInfo.Values[1].Description
      );
      expect(warrentyNames[2]).toHaveText(product.WarrantyInfo.Values[2].Name);
      expect(warrentyNames[3]).toHaveText(product.WarrantyInfo.Values[3].Name);
      expect(warrentyNames[3]).toHaveText(product.WarrantyInfo.Values[3].Name);
      expect(warrentyNames[4]).toHaveText(product.WarrantyInfo.Values[4].Name);
      expect(warrentyDescriptions[4]).toHaveText(
        product.WarrantyInfo.Values[4].Description
      );
      expect(warrentyNames[5]).toHaveText(product.WarrantyInfo.Values[5].Name);
    });
  });

  it('should render esp-product-charges component', () => {
    const productChargesComponent = spectator.query(
      '.product-info-esp-product-charges'
    );
    expect(productChargesComponent).toBeTruthy();
  });

  describe('Battery Info', () => {
    it('should have product details', () => {
      const len = product.BatteryInfo.Values.length;
      expect(spectator.queryAll('.product-battery-name').length).toEqual(len);
      product.BatteryInfo.Values.forEach((batteryInfo) => {
        expect(spectator.queryAll('.product-battery-name')).toHaveText(
          batteryInfo.Name
        );
        expect(spectator.queryAll('.product-battery-description')).toHaveText(
          batteryInfo.Description
        );
      });
    });

    it('Should display Required, Included, size and number of batteries without comments', () => {
      product.BatteryInfo = {
        Values: [
          {
            Name: 'Batteries Required',
          },
          {
            Name: 'Batteries Included',
          },
          {
            Name: 'Battery Size',
            Description: '40 watt',
          },
          {
            Name: 'Number of Batteries',
            Description: '2',
          },
          {
            Name: 'Additional battery type',
          },
          {
            Name: 'Additional battery type 2',
          },
        ],
      };
      spectator.detectChanges();
      const batteryNames = spectator.queryAll('.product-battery-name');
      const batteryDescriptions = spectator.queryAll(
        '.product-battery-description'
      );
      expect(batteryNames[0]).toHaveText(product.BatteryInfo.Values[0].Name);
      expect(batteryNames[1]).toHaveText(product.BatteryInfo.Values[1].Name);
      expect(batteryNames[2]).toHaveText(product.BatteryInfo.Values[2].Name);
      expect(batteryDescriptions[2]).toHaveText(
        product.BatteryInfo.Values[2].Description
      );
      expect(batteryNames[3]).toHaveText(product.BatteryInfo.Values[3].Name);
      expect(batteryDescriptions[3]).toHaveText(
        product.BatteryInfo.Values[3].Description
      );
      expect(batteryNames[3]).toHaveText(product.BatteryInfo.Values[3].Name);
      expect(batteryNames[4]).toHaveText(product.BatteryInfo.Values[4].Name);
      expect(batteryNames[5]).toHaveText(product.BatteryInfo.Values[5].Name);
    });
    it('should not show if it does not exist', () => {
      product.BatteryInfo = null;
      spectator.detectChanges();
      expect(spectator.query('.product-battery-name')).not.toExist();
    });
  });
});
