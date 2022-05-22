import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { EvalDisplayValuePipe } from '@smartlink/products';
import { AttributeValue, Product } from '@smartlink/models';
import { ProductsMockDb } from '@smartlink/products/mocks';
import { MockComponents } from 'ng-mocks';
import { ProductChargesTableComponentModule } from '../product-charges-table';
import { ProductChargesTableComponent } from '../product-charges-table/product-charges-table.component';
import {
  ProductImprintMethodsComponent,
  ProductImprintMethodsComponentModule,
} from './product-imprint-methods.component';

const samples = [
  {
    Name: 'Product Sample',
    Description: 'free & on stock',
    Charges: [
      {
        TypeCode: 'SPCH',
        Type: 'Shipping Charge',
        Description: 'Product Sample, Spec Sample',
        Prices: [
          {
            Quantity: {
              From: 1,
              To: 2147483647,
              $index: 1,
            },
            Price: 40,
            Cost: 40,
            DiscountCode: 'Z',
            CurrencyCode: 'USD',
            IsQUR: false,
          },
        ],
        IsRequired: false,
      },
    ],
    $index: 3,
  },
  {
    Name: 'Spec Sample',
    Description: 'making sample time 2 days',
    Charges: [
      {
        TypeCode: 'SPCH',
        Type: 'Shipping Charge',
        Description: 'Product Sample, Spec Sample',
        Prices: [
          {
            Quantity: {
              From: 1,
              To: 2147483647,
              $index: 1,
            },
            Price: 40,
            Cost: 40,
            DiscountCode: 'Z',
            CurrencyCode: 'USD',
            IsQUR: false,
          },
        ],
        IsRequired: false,
      },
    ],
  },
];

describe('ProductImprintMethodsComponent', () => {
  let spectator: Spectator<ProductImprintMethodsComponent>;
  let product: Product;
  const createComponent = createComponentFactory({
    component: ProductImprintMethodsComponent,
    imports: [ProductImprintMethodsComponentModule],
    overrideModules: [
      [
        ProductChargesTableComponentModule,
        {
          set: {
            declarations: MockComponents(ProductChargesTableComponent),
            exports: MockComponents(ProductChargesTableComponent),
          },
        },
      ],
    ],
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

  describe('Imprinting Method Section Information', () => {
    it('should show the correct imprint methods', () => {
      const methods = product.Imprinting?.Methods?.Values?.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-method-section')).toHaveText(methods);
    });

    it('should not show the imprint methods', () => {
      product.Imprinting.Methods = null;
      spectator.detectChanges();
      expect(spectator.query('.imprint-method-section')).not.toExist();
    });
  });

  it('should show the correct single imprint methods name', () => {
    product.Imprinting.Methods.Values = [
      {
        Code: '$UNI',
        Name: 'imprinted',
        Options: [],
      },
    ];
    spectator.detectChanges();
    expect(spectator.query('.imprint-method-section')).toHaveText('imprinted');
  });

  it('should show multiple imprint methods name completely if name is very big', () => {
    product.Imprinting.Methods.Values = [
      {
        Code: '$UNI',
        Name: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
        Options: [],
      },
      {
        Code: '$UNI',
        Name: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
        Options: [],
      },
    ];
    spectator.detectChanges();
    const methods = product.Imprinting?.Methods?.Values?.map(
      (m: AttributeValue) => m.Name
    ).join(', ');
    expect(spectator.query('.imprint-method-section')).toHaveText(methods);
  });

  it('should show the correct imprint methods name when methods are more than 30', () => {
    product.Imprinting.Methods.Values = [
      { Code: '$UNI', Name: 'imprinted', Options: [] },
      { Code: '$UNI', Name: 'imprinted1', Options: [] },
      { Code: '$UNI', Name: 'imprinted2', Options: [] },
      { Code: '$UNI', Name: 'imprinted3', Options: [] },
      { Code: '$UNI', Name: 'imprinted4', Options: [] },
      { Code: '$UNI', Name: 'imprinted5', Options: [] },
      { Code: '$UNI', Name: 'imprinted6', Options: [] },
      { Code: '$UNI', Name: 'imprinted7', Options: [] },
      { Code: '$UNI', Name: 'imprinted8', Options: [] },
      { Code: '$UNI', Name: 'imprinted9', Options: [] },
      { Code: '$UNI', Name: 'imprinted10', Options: [] },
      { Code: '$UNI', Name: 'imprinted11', Options: [] },
      { Code: '$UNI', Name: 'imprinted12', Options: [] },
      { Code: '$UNI', Name: 'imprinted13', Options: [] },
      { Code: '$UNI', Name: 'imprinted14', Options: [] },
      { Code: '$UNI', Name: 'imprinted15', Options: [] },
      { Code: '$UNI', Name: 'imprinted16', Options: [] },
      { Code: '$UNI', Name: 'imprinted17', Options: [] },
      { Code: '$UNI', Name: 'imprinted18', Options: [] },
      { Code: '$UNI', Name: 'imprinted19', Options: [] },
      { Code: '$UNI', Name: 'imprinted20', Options: [] },
      { Code: '$UNI', Name: 'imprinted21', Options: [] },
      { Code: '$UNI', Name: 'imprinted22', Options: [] },
      { Code: '$UNI', Name: 'imprinted23', Options: [] },
      { Code: '$UNI', Name: 'imprinted24', Options: [] },
      { Code: '$UNI', Name: 'imprinted25', Options: [] },
      { Code: '$UNI', Name: 'imprinted26', Options: [] },
      { Code: '$UNI', Name: 'imprinted27', Options: [] },
      { Code: '$UNI', Name: 'imprinted28', Options: [] },
      { Code: '$UNI', Name: 'imprinted29', Options: [] },
      { Code: '$UNI', Name: 'imprinted30', Options: [] },
      { Code: '$UNI', Name: 'imprinted31', Options: [] },
    ];
    spectator.detectChanges();
    const methods = product.Imprinting?.Methods?.Values?.map(
      (m: AttributeValue) => m.Name
    ).join(', ');
    expect(spectator.query('.imprint-method-section')).toHaveText(methods);
    expect(spectator.query('.imprint-method-section')).toHaveText('imprinted');
  });

  it('should render esp-product-charges component', () => {
    const productChargesComponent = spectator.query(
      '.imprint-methods-esp-product-charges'
    );
    expect(productChargesComponent).toBeTruthy();
  });

  describe('Imprinting Color Information', () => {
    it('item-list-column class should not be used when colors length < 10', () => {
      expect(spectator.query('.color-value-list')).not.toHaveClass(
        'item-list-columns'
      );
    });

    it('item-list-column class should be used when colors length > 10', () => {
      const color1 = 'Standard';
      const color2 = 'Normal';
      product.Imprinting.Colors.Values = [
        { Code: '$2HM', Name: color1, Options: [] },
        { Code: '$2HM', Name: color2, Options: [] },
        { Code: '$2HM', Name: color1, Options: [] },
        { Code: '$2HM', Name: color2, Options: [] },
        { Code: '$2HM', Name: color1, Options: [] },
        { Code: '$2HM', Name: color2, Options: [] },
        { Code: '$2HM', Name: color1, Options: [] },
        { Code: '$2HM', Name: color2, Options: [] },
        { Code: '$2HM', Name: color1, Options: [] },
        { Code: '$2HM', Name: color2, Options: [] },
        { Code: '$2HM', Name: color1, Options: [] },
        { Code: '$2HM', Name: color2, Options: [] },
      ];
      spectator.detectChanges();
      expect(spectator.query('.color-value-list')).toHaveClass(
        'item-list-columns'
      );
    });

    it('should display correct color values when multiple colors', () => {
      const color1 = 'Standard';
      const color2 = 'Normal';
      product.Imprinting.Colors.Values = [
        {
          Code: '$2HM',
          Name: color1,
          Options: [],
        },
        {
          Code: '$2HM',
          Name: color2,
          Options: [],
        },
      ];
      spectator.detectChanges();
      const colors = spectator.queryAll('.color-value');
      expect(colors.length).toEqual(2);
      expect(colors[0]).toContainText(color1);
      expect(colors[1]).toContainText(color2);
    });
  });

  describe('Imprinting Location Information', () => {
    it('should show the correct Location values', () => {
      const locations = product.Imprinting?.Locations?.Values.join(', ');
      expect(spectator.query('.imprint-locations')).toHaveText(locations);
    });

    it('should not show imprint locations', () => {
      product.Imprinting.Locations = null;
      spectator.detectChanges();
      expect(spectator.query('.imprint-locations')).not.toExist();
    });

    it('should show the correct Location values with one entry', () => {
      product.Imprinting.Locations.Values = ['India'];
      spectator.detectChanges();
      expect(spectator.query('.imprint-locations')).toHaveExactText('India');
    });

    it('should not hide or show imprint locations header', () => {
      expect(spectator.query('.imprint-locations-heading')).toHaveText(
        'Imprint Locations'
      );
      product.Imprinting.Locations = null;
      spectator.detectChanges();
      expect(spectator.query('.imprint-locations-heading')).not.toExist();
    });

    it('should not show Location Charges if charges do not exist', () => {
      expect(spectator.query('.location-charges')).toBeHidden();
    });
  });

  describe('Imprinting Sizes Information', () => {
    it('should not show imprint sizes', () => {
      product.Imprinting.Sizes = null;
      spectator.detectChanges();
      expect(spectator.query('.imprint-sizes')).not.toExist();
    });

    it('should show the correct Size values', () => {
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });

    it('should show the Size label', () => {
      expect(spectator.query('.imprint-sizes-label')).toHaveText(
        'Imprint Sizes'
      );
    });

    it('should hide Size label', () => {
      product.Imprinting.Sizes = null;
      spectator.detectChanges();
      expect(spectator.query('.imprint-sizes-label')).toBeFalsy();
    });

    it('should show the correct size type', () => {
      expect(spectator.query('.imprint-size-type')).toHaveText(
        'Imprint Location'
      );
    });
  });

  describe('Imprinting Full Color Process Information', () => {
    it('should show the correct color process value', () => {
      product.Imprinting.FullColorProcess = true;
      spectator.detectChanges();
      expect(spectator.query('.full-color-process')).toHaveText('Yes');
    });

    it("should show 'No' color process value", () => {
      product.Imprinting.FullColorProcess = false;
      spectator.detectChanges();
      expect(spectator.query('.full-color-process')).toHaveText('No');
    });

    it("should show 'not specified' color process value", () => {
      product.Imprinting.FullColorProcess = null;
      spectator.detectChanges();
      expect(spectator.query('.full-color-process')).toHaveText(
        'Supplier has not specified'
      );
    });
  });

  describe('Imprinting Personalization Information', () => {
    it('should show the correct Personalization value', () => {
      const pipe = new EvalDisplayValuePipe();
      const expectedResult = pipe.transform(product.Imprinting.Personalization);
      expect(spectator.query('.personalization')).toHaveText(expectedResult);
    });

    it("should show 'No' Personalization value", () => {
      product.Imprinting.Personalization = false;
      spectator.detectChanges();
      expect(spectator.query('.personalization')).toHaveText('No');
    });

    it("should show 'not specified' Personalization value", () => {
      product.Imprinting.Personalization = null;
      spectator.detectChanges();
      expect(spectator.query('.personalization')).toHaveText(
        'Supplier has not specified'
      );
    });
  });
  ``;

  describe('Imprinting Sold Unimprinted Information', () => {
    it("should show 'Yes' Sold Unimprinted value", () => {
      product.Imprinting.SoldUnimprinted = true;
      spectator.detectChanges();
      expect(spectator.query('.sold-unimprinted')).toHaveText('Yes');
    });

    it("should show 'NO' Sold Unimprinted value", () => {
      product.Imprinting.SoldUnimprinted = false;
      spectator.detectChanges();
      expect(spectator.query('.sold-unimprinted')).toHaveText('No');
    });

    it("should show 'Supplier not specified' Sold Unimprinted value", () => {
      product.Imprinting.SoldUnimprinted = null;
      spectator.detectChanges();
      expect(spectator.query('.sold-unimprinted')).toHaveText(
        'Supplier has not specified'
      );
    });
  });

  describe('Imprinting Additional Information', () => {
    it('should not show Additional Information', () => {
      product.Imprinting.AdditionalInfo = null;
      spectator.detectChanges();
      expect(spectator.query('.additional-information')).not.toExist();
    });

    it('should show the correct Additional Information value', () => {
      expect(spectator.query('.additional-information')).toHaveText(
        product.Imprinting?.AdditionalInfo
      );
    });

    it('should show the Additional Information Header', () => {
      expect(spectator.query('.product-additional-information')).toHaveText(
        'Additional Information'
      );
    });

    it('should hide the Additional Information Header', () => {
      product.Imprinting.AdditionalInfo = null;
      spectator.detectChanges();
      expect(spectator.query('.product-additional-information')).toBeFalsy();
    });
  });

  describe('Imprinting Optional Value Information', () => {
    it('should verify if all the Imprinting options without groups are rendered on the page', () => {
      const mockProductOption = product.Imprinting.Options;
      const productWithoutGroups = mockProductOption.filter(
        (prod) => !prod.Groups
      );
      const optionValueNoGroupElements = spectator.queryAll(
        '.option-val-no-group'
      );
      expect(optionValueNoGroupElements.length).toEqual(
        productWithoutGroups.length
      );
    });

    it('should verify Imprinting option values with no group', () => {
      const optionValueNoGroupElements = spectator.queryAll(
        '.option-val-no-group'
      );
      expect(optionValueNoGroupElements[0]).toHaveExactText(
        ' Screen Printed Plastisol Heat Transfer Additional Colors - Up to 8 Colors '
      );
      expect(optionValueNoGroupElements[1]).toHaveExactText(
        ' Gold, Rose Gold, Silver '
      );
    });

    it('should test Imprinting options without group values', () => {
      const mockProductOption = product.Imprinting.Options;
      const productWithoutGroups = mockProductOption.filter(
        (prod) => !prod.Groups
      );
      const imprintOptionNames = spectator.queryAll(
        '.imprint-option-name-no-group'
      );
      imprintOptionNames.forEach((optionName, index) => {
        expect(optionName).toHaveText(productWithoutGroups[index].Name);
      });
    });

    it('should verify Imprinting option values with group', () => {
      const optionValueWithGroupElements = spectator.queryAll(
        '.option-val-with-group'
      );
      expect(optionValueWithGroupElements[0]).toHaveExactText(
        ' Applying Sticker / Tagging, Edit Charge, Metallic; Neon; Name Brand Thread / Colors, Oversize Charge, Sewing Patches, Sewing Private Label '
      );
    });

    it('should verify if all the Imprinting options with groups are rendered on the page', () => {
      const mockProductOption = product.Imprinting.Options;
      const productWithGroups = mockProductOption.filter((prod) => prod.Groups);
      const optionValueWithGroupElements = spectator.queryAll(
        '.option-val-with-group'
      );
      expect(optionValueWithGroupElements.length).toEqual(
        productWithGroups.length
      );
    });

    it('should test Imprinting methods with group values', () => {
      const mockProductOption = product.Imprinting.Options;
      const productWithGroups = mockProductOption.filter((prod) => prod.Groups);
      const imprintOptionNames = spectator.queryAll(
        '.imprint-option-name-group'
      );
      imprintOptionNames.forEach((optionName, index) => {
        expect(optionName).toHaveExactText(
          productWithGroups[index].Type === 'Imprint Option'
            ? ` Imprint Option: ${productWithGroups[index].Name} `
            : ` ${productWithGroups[index].Name} `
        );
      });
    });

    it('should show imprint method label', () => {
      product.Imprinting.Methods = {
        Values: [
          {
            Code: '$UNI',
            Name: 'Unimprinted',
            Options: null,
          },
        ],
      };
      spectator.detectChanges();
      expect(spectator.query('.imprint-method-label')).toHaveText(
        'Imprint Methods'
      );
    });

    it('should hide imprint method label', () => {
      product.Imprinting.Methods = null;
      spectator.detectChanges();
      expect(spectator.query('.imprint-method-label')).toBeFalsy();
    });
  });

  it('should get service charges', () => {
    expect(spectator.component.hasServiceCharges).toBeTruthy();
  });

  it('should get option title', () => {
    const optionTitle = spectator.component.getOptionTitle({
      Name: 'Additional Locations',
      Type: 'Add. Color Charge',
    });
    const optionTitle2 = spectator.component.getOptionTitle({
      Name: '',
      Type: 'Additional Colors',
    });
    const optionTitle3 = spectator.component.getOptionTitle({
      Name: 'Colors',
      Type: '',
    });
    expect(optionTitle).toBe('Additional Locations');
    expect(optionTitle2).toBe('Additional Colors');
    expect(optionTitle3).toBe('Imprint Option: Colors');
  });

  describe('Artwork', () => {
    it('should display correct label values', () => {
      const label = 'Artwork & Proofs';
      expect(spectator.query('.product-imprint-artwork')).toHaveText(label);
    });

    it('should display correct artwork values', () => {
      const artwork = spectator.queryAll('.product-imprint-artwork-values');
      expect(artwork[0].innerHTML).toContain('Art Services');
      expect(artwork[1].innerHTML).toContain(
        'Embroidery - Pre Production Sample'
      );
    });
  });

  describe('Apparel bra', () => {
    it('should display correct sizes when product having single size belonging to size type Apparel Bra including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: 'small',
          Options: [
            {
              Type: 'Apparel Bra',
              Values: ['small'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });

    it('should display correct sizes when product having multiple sizes belonging to size type Apparel Bra including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: 'small',
          Options: [
            {
              Type: 'Apparel Bra',
              Values: ['small', 'medium'],
            },
          ],
        },
        {
          Code: '$2HQ',
          Name: 'medium',
          Options: [
            {
              Type: 'Apparel Bra',
              Values: ['medium', 'small'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });
  });

  describe('Apparel Shirt', () => {
    it('should display correct sizes when product having single size belonging to size type Apparel - Dress Shirts including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: 'small',
          Options: [
            {
              Type: 'Apparel Shirt',
              Values: ['small'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });

    it('should display correct sizes when product having multiple sizes belonging to size type Apparel - Dress Shirts including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: 'small',
          Options: [
            {
              Type: 'Apparel Shirt',
              Values: ['small', 'medium'],
            },
          ],
        },
        {
          Code: '$2HQ',
          Name: 'medium',
          Options: [
            {
              Type: 'Apparel Shirt',
              Values: ['medium', 'small'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });
  });

  describe('Apparel -Hoisery/Uniform', () => {
    it('should display correct sizes when product having single size belonging to size type Apparel -Hoisery/Uniform including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: 's',
          Options: [
            {
              Type: 'Apparel -Hoisery/Uniform',
              Values: ['l', 'xl'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });

    it('should display correct sizes when product having multiple sizes belonging to size type Apparel -Hoisery/Uniform including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: 's',
          Options: [
            {
              Type: 'Apparel -Hoisery/Uniform',
              Values: ['l', 'xl'],
            },
          ],
        },
        {
          Code: '$2HQ',
          Name: 'm',
          Options: [
            {
              Type: 'Apparel -Hoisery/Uniform',
              Values: ['l', 'xl'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });
  });

  describe('Apparel Girls', () => {
    it('should display correct sizes when product having single size belonging to size type Apparel Girls including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: 'small',
          Options: [
            {
              Type: 'Apparel Girls',
              Values: ['small', 'large'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });

    it('should display correct sizes when product having multiple sizes belonging to size type Apparel Girls including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: 'small',
          Options: [
            {
              Type: 'Apparel Girls',
              Values: ['small', 'medium'],
            },
          ],
        },
        {
          Code: '$2HQ',
          Name: 'medium',
          Options: [
            {
              Type: 'Apparel Shirt',
              Values: ['medium', 'large'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });
  });

  describe('Apparel Pants', () => {
    it('should display correct sizes when product having single size belonging to size type Apparel Pants including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: 'small',
          Options: [
            {
              Type: 'Apparel Pants',
              Values: ['small', 'large'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });

    it('should display correct sizes when product having multiple sizes belonging to size type Apparel Pants including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: 'small',
          Options: [
            {
              Type: 'Apparel Pants',
              Values: ['small', 'medium'],
            },
          ],
        },
        {
          Code: '$2HQ',
          Name: 'medium',
          Options: [
            {
              Type: 'Apparel Shirt',
              Values: ['medium', 'large'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });

    it('should display correct sizes of a product that has more than 100 sizes(around 150) associated against a size type Apparel say - Apparel Pants.', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: 'small',
          Options: [
            {
              Type: 'Apparel Pants',
              Values: [
                'xxs',
                'xs',
                's',
                'm',
                'l',
                'xl',
                'xxl',
                'xxxl',
                'xxs',
                'xs',
                's',
                'm',
                'l',
                'xl',
                'xxl',
                'xxxl',
                'xxs',
                'xs',
                's',
                'm',
                'l',
                'xl',
                'xxl',
                'xxxl',
                'xxs',
                'xs',
                's',
                'm',
                'l',
                'xl',
                'xxl',
                'xxxl',
                'xxs',
                'xs',
                's',
                'm',
                'l',
                'xl',
                'xxl',
                'xxxl',
                'xxs',
                'xs',
                's',
                'm',
                'l',
                'xl',
                'xxl',
                'xxxl',
                'xxs',
                'xs',
                's',
                'm',
                'l',
                'xl',
                'xxl',
                'xxxl',
                'xxs',
                'xs',
                's',
                'm',
                'l',
                'xl',
                'xxl',
                'xxxl',
                'xxs',
                'xs',
                's',
                'm',
                'l',
                'xl',
                'xxl',
                'xxxl',
              ],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });
  });

  describe('Apparel Infant - Toddler', () => {
    it('should display correct sizes when product having single size belonging to size type Apparel Infant - Toddler including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: 'small',
          Options: [
            {
              Type: 'Apparel Infant - Toddler',
              Values: ['small', 'large'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });

    it('should display correct sizes when product having multiple sizes belonging to size type Apparel Infant - Toddler including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: 'small',
          Options: [
            {
              Type: 'Apparel Infant - Toddler',
              Values: ['small', 'medium'],
            },
          ],
        },
        {
          Code: '$2HQ',
          Name: 'medium',
          Options: [
            {
              Type: 'Apparel Infant - Toddler',
              Values: ['medium', 'large'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });
  });

  describe('Apparel Standard and Numbered', () => {
    it('should display correct sizes when product having single size belonging to size type Apparel Standard and Numbered including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: 'small',
          Options: [
            {
              Type: 'Apparel Standard and Numbered',
              Values: ['small', 'large'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });

    it('should display correct sizes when product having multiple sizes belonging to size type Apparel Standard and Numbered including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: 'small',
          Options: [
            {
              Type: 'Apparel Standard and Numbered',
              Values: ['small', 'medium'],
            },
          ],
        },
        {
          Code: '$2HQ',
          Name: 'medium',
          Options: [
            {
              Type: 'Apparel Standard and Numbered',
              Values: ['medium', 'large'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });
  });

  describe('Capacity', () => {
    it('should display correct sizes when product having single size belonging to size type Capacity including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: 'small',
          Options: [
            {
              Type: 'Capacity',
              Values: ['small', 'large'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });

    it('should display correct sizes when product having multiple sizes belonging to size type Capacity including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: 'small',
          Options: [
            {
              Type: 'Capacity',
              Values: ['small', 'medium'],
            },
          ],
        },
        {
          Code: '$2HQ',
          Name: 'medium',
          Options: [
            {
              Type: 'Capacity',
              Values: ['medium', 'large'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });

    it('should display correct sizes that has more than 100 sizes(around 150) associated against a size type Capacity', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: 'small',
          Options: [
            {
              Type: 'Capacity',
              Values: [
                '1l',
                '2l',
                '3l',
                '4l',
                '5l',
                '6l',
                '7l',
                '8l',
                '1l',
                '2l',
                '3l',
                '4l',
                '5l',
                '6l',
                '7l',
                '8l',
                '1l',
                '2l',
                '3l',
                '4l',
                '5l',
                '6l',
                '7l',
                '8l',
                '1l',
                '2l',
                '3l',
                '4l',
                '5l',
                '6l',
                '7l',
                '8l',
                '1l',
                '2l',
                '3l',
                '4l',
                '5l',
                '6l',
                '7l',
                '8l',
                '1l',
                '2l',
                '3l',
                '4l',
                '5l',
                '6l',
                '7l',
                '8l',
                '1l',
                '2l',
                '3l',
                '4l',
                '5l',
                '6l',
                '7l',
                '8l',
                '1l',
                '2l',
                '3l',
                '4l',
                '5l',
                '6l',
                '7l',
                '8l',
                '1l',
                '2l',
                '3l',
                '4l',
                '5l',
                '6l',
                '7l',
                '8l',
                '1l',
                '2l',
                '3l',
                '4l',
                '5l',
                '6l',
                '7l',
                '8l',
              ],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });
  });

  describe('Display - Dimension - Thickness/ Height/ Diameter', () => {
    it('should display correct sizes when product having single size belonging to size type Display - Dimension - Thickness/ Height/ Diameter including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: '20L 20W 20H',
          Options: [
            {
              Type: 'Display - Dimension - Thickness/ Height/ Diameter',
              Values: ['20L 20W 20H', '40L 40W 40H'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });

    it('should display correct sizes when product having multiple sizes belonging to size type Display - Dimension - Thickness/ Height/ Diameter including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: '20L 20W 20H',
          Options: [
            {
              Type: 'Display - Dimension - Thickness/ Height/ Diameter',
              Values: ['20L 5W 50H', '10L 10W 10H'],
            },
          ],
        },
        {
          Code: '$2HQ',
          Name: '60L 60W 60H',
          Options: [
            {
              Type: 'Display - Dimension - Thickness/ Height/ Diameter',
              Values: ['20L 20W 20H', '60L 60W 60H'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });
  });

  describe('Volume', () => {
    it('should display correct sizes when product having single size belonging to size type Volume including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: '5 cubic centimeter',
          Options: [
            {
              Type: 'Volume',
              Values: ['5 cubic centimeter', '50 cubic centimeter'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });

    it('should display correct sizes when product having multiple sizes belonging to size type Volume including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: '5 cubic centimeter',
          Options: [
            {
              Type: 'Volume',
              Values: ['5 cubic centimeter', '50 cubic centimeter'],
            },
          ],
        },
        {
          Code: '$2HQ',
          Name: 'medium',
          Options: [
            {
              Type: 'Volume',
              Values: ['50 cubic centimeter', '500 cubic centimeter'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });

    it('should display correct sizes that has more than 100 sizes(around 150) associated against a size type Volume', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: 'small',
          Options: [
            {
              Type: 'Volume',
              Values: [
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
                '1m x 2m x 3m',
                '2m x 3m x 4m',
              ],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });
  });

  describe('Size - Other', () => {
    it('should display correct sizes when product having single size belonging to size type Other including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: '20cm',
          Options: [
            {
              Type: 'Other',
              Values: ['45cm', '6cm', '1cm', '10cm'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });

    it('should display correct sizes when product having multiple sizes belonging to size type Other including multiple custom sizes', () => {
      product.Imprinting.Sizes.Values = [
        {
          Code: '$2HQ',
          Name: '6cm',
          Options: [
            {
              Type: 'Other',
              Values: ['45cm', '6cm', '1cm', '10cm'],
            },
          ],
        },
        {
          Code: '$2HQ',
          Name: '90cm',
          Options: [
            {
              Type: 'Other',
              Values: ['45cm', '6cm', '1cm', '10cm'],
            },
          ],
        },
      ];
      spectator.detectChanges();
      const sizes = product.Imprinting?.Sizes?.Values.map(
        (m: AttributeValue) => m.Name
      ).join(', ');
      expect(spectator.query('.imprint-sizes')).toHaveText(sizes);
    });
  });

  describe('Samples', () => {
    it('section should be displayed correctly with Spec Sample label value only.', () => {
      product.Samples.Values = [samples[1]];
      spectator.detectChanges();
      const imprintSamples = spectator.queryAll('.sample-name > b');
      expect(imprintSamples.length).toBe(1);
      expect(imprintSamples[0]).toHaveText(samples[1].Name);
    });

    it('section should be displayed correctly with Product Sample label value only.', () => {
      product.Samples.Values = [samples[0]];
      spectator.detectChanges();
      const imprintSamples = spectator.queryAll('.sample-name > b');
      expect(imprintSamples.length).toBe(1);
      expect(imprintSamples[0]).toHaveText(samples[0].Name);
    });

    it('section should be displayed correctly with Product Sample and Spec sample values only.', () => {
      product.Samples.Values = [...samples];
      spectator.detectChanges();
      const imprintSamples = spectator.queryAll('.sample-name > b');
      expect(imprintSamples.length).toBe(2);
      expect(imprintSamples[0]).toHaveText(samples[0].Name);
      expect(imprintSamples[1]).toHaveText(samples[1].Name);
    });

    it('section should not be displayed.', () => {
      product.Samples.Values = null;
      spectator.detectChanges();
      expect(spectator.query('.product-imprint-samples')).toBeFalsy();
    });
  });
});
