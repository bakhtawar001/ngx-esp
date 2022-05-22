import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Presentation,
  PresentationProduct,
  PresentationProductAttribute,
} from '@esp/models';
import { mockPresentationProduct } from '@esp/__mocks__/presentations';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { Store } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import {
  PresentationProductAdditionalChargesComponent,
  PresentationProductAdditionalChargesComponentModule,
  PresentationProductImageComponent,
  PresentationProductImageComponentModule,
  PresentationProductImagesComponent,
  PresentationProductImagesComponentModule,
  PresentationProductImprintComponent,
  PresentationProductImprintComponentModule,
  PresentationProductVariantComponent,
  PresentationProductVariantComponentModule,
} from '../../components';
import {
  PresentationProductPriceGridsComponent,
  PresentationProductPriceGridsModule,
} from './components';
import { PresentationProductLocalState } from './presentation-product.local-state';
import {
  PresentationProductPage,
  PresentationProductPageModule,
} from './presentation-product.page';

class IntersectionObserverMock {
  readonly root: Element | null;

  readonly rootMargin: string;

  readonly thresholds: ReadonlyArray<number>;

  constructor() {
    this.root = null;
    this.rootMargin = '';
    this.thresholds = [];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  observe() {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  unobserve() {}
}
window.IntersectionObserver = IntersectionObserverMock;

const mockPresentationProducts = [
  { Id: 1000, ProductId: 5000 },
  { Id: 1001, ProductId: 5001 },
  { Id: 1002, ProductId: 5002 },
  { Id: 1003, ProductId: 5003 },
].map((productId) =>
  mockPresentationProduct((product) => {
    product.Id = productId.Id;
    product.ProductId = productId.ProductId;
    return product;
  })
);

describe('PresentationProductPage', () => {
  const createComponent = createComponentFactory({
    component: PresentationProductPage,
    imports: [PresentationProductPageModule, RouterTestingModule],
    providers: [
      mockProvider(MatDialog),
      mockProvider(Store, {
        select: () => of('empty'),
      }),
    ],
    overrideModules: [
      [
        PresentationProductImageComponentModule,
        {
          set: {
            declarations: MockComponents(PresentationProductImageComponent),
            exports: MockComponents(PresentationProductImageComponent),
          },
        },
      ],
      [
        PresentationProductImagesComponentModule,
        {
          set: {
            declarations: MockComponents(PresentationProductImagesComponent),
            exports: MockComponents(PresentationProductImagesComponent),
          },
        },
      ],
      [
        PresentationProductVariantComponentModule,
        {
          set: {
            declarations: MockComponents(PresentationProductVariantComponent),
            exports: MockComponents(PresentationProductVariantComponent),
          },
        },
      ],
      [
        PresentationProductImprintComponentModule,
        {
          set: {
            declarations: MockComponents(PresentationProductImprintComponent),
            exports: MockComponents(PresentationProductImprintComponent),
          },
        },
      ],
      [
        PresentationProductPriceGridsModule,
        {
          set: {
            declarations: MockComponents(
              PresentationProductPriceGridsComponent
            ),
            exports: MockComponents(PresentationProductPriceGridsComponent),
          },
        },
      ],
      [
        PresentationProductAdditionalChargesComponentModule,
        {
          set: {
            declarations: MockComponents(
              PresentationProductAdditionalChargesComponent
            ),
            exports: MockComponents(
              PresentationProductAdditionalChargesComponent
            ),
          },
        },
      ],
    ],
  });

  const testSetup = (options?: {
    hasLoaded?: boolean;
    isLoading?: boolean;
    product?: PresentationProduct;
    presentation?: Presentation;
  }) => {
    const spectator = createComponent({
      providers: [
        mockProvider(PresentationProductLocalState, {
          hasLoaded: options?.hasLoaded,
          isLoading: options?.isLoading ?? false,
          product: options?.product,
          presentation: options?.presentation,
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          getPresentation: (presentationId) => {},
          connect() {
            return of(this);
          },
        }),
      ],
    });
    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it("should display a loader when the page hasn't loaded", () => {
    // Arrange
    const { spectator } = testSetup();
    const loader = spectator.query('esp-presentation-product-loader');
    // Assert
    expect(loader).toExist();
  });

  it("should display the header 'Edit Product details' correctly", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    const editProductsHeader = spectator.query('.header-style-24');

    // Assert
    expect(editProductsHeader).toBeVisible();
    expect(editProductsHeader).toHaveText('Edit Product Details');
  });

  it("should display the Sort Menu button correctly with text 'Product Detail Menu'", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    const sortMenuBtn = spectator.query('.presentation-product__mobile-menu');
    const sortMenuBtnIcon = spectator.query(
      '.presentation-product__mobile-menu > i'
    );

    // Assert
    expect(sortMenuBtn).toBeVisible();
    expect(sortMenuBtn).toHaveText('Product Detail Menu');
    expect(sortMenuBtn).toHaveDescendant(sortMenuBtnIcon);
    expect(sortMenuBtnIcon).toHaveClass('fa fa-ellipsis-v');
  });

  it("should display the menu options as 'Save Changes', 'Preview' and 'Next Product', respectively", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    const sortMenuBtn = spectator.query('.presentation-product__mobile-menu');
    spectator.click(sortMenuBtn);
    spectator.detectComponentChanges();
    const menuOptions = spectator.queryAll(
      '.presentation-product__mobile-controls > button'
    );
    const menuOptionsIcons = spectator.queryAll(
      '.presentation-product__mobile-controls > button > i'
    );

    // Assert
    expect(menuOptions[0]).toHaveText('Save Changes');
    expect(menuOptions[0]).toHaveDescendant(menuOptionsIcons[0]);
    expect(menuOptionsIcons[0]).toHaveClass('fa fa-save');
    expect(menuOptions[1]).toHaveText('Preview');
    expect(menuOptions[1]).toHaveDescendant(menuOptionsIcons[1]);
    expect(menuOptionsIcons[1]).toHaveClass('fa fa-eye');
    expect(menuOptions[2]).toHaveText('Next Product');
    expect(menuOptions[2]).toHaveDescendant(menuOptionsIcons[2]);
    expect(menuOptionsIcons[2]).toHaveClass('fa fa-arrow-right');
  });

  describe('Product Carousel', () => {
    it('Should display an Edit Product link when a user clicks on a product in the carousel', () => {
      //Arrange
      const { spectator, component } = testSetup({
        hasLoaded: true,
        isLoading: false,
        product: { ...mockPresentationProducts[0] },
        presentation: {
          Id: 100,
          Products: mockPresentationProducts,
        } as unknown as Presentation,
      });

      //Act
      const cardsWithEditButton = spectator.queryAll(
        '.cos-product-nav-items-container > .cos-product-navigation-card > div.edit-button-wrapper > button.cos-stroked-button'
      );
      const selectedCardWithoutEditButton = spectator.queryAll(
        '.cos-product-nav-items-container > .cos-product-navigation-card.selected'
      );

      //Assert
      expect(component.state.presentation.Products.length).toBe(
        mockPresentationProducts.length
      );
      expect(cardsWithEditButton.length).toEqual(
        component.state.presentation.Products.length -
          selectedCardWithoutEditButton.length
      );
      cardsWithEditButton.forEach((productCard) => {
        expect(productCard).toHaveText('Edit Product');
      });
    });
    it('Should display a 3 dot menu in the docked carousel', () => {
      //Arrange
      const { spectator, component } = testSetup({
        hasLoaded: true,
        isLoading: false,
        product: { ...mockPresentationProducts[0] },
        presentation: {
          Id: 100,
          Products: mockPresentationProducts,
        } as unknown as Presentation,
      });

      //Assert
      const productNavigation = spectator.query('cos-product-navigation');
      expect(productNavigation).toExist();
      expect(productNavigation).not.toHaveClass('is-docked');

      //Act
      productNavigation.classList.toggle('is-docked', true);
      spectator.detectComponentChanges();

      //Re-Assert
      expect(productNavigation).toHaveClass('is-docked');
      const threeDotMenu = spectator.query(
        '.cos-product-navigation-menu > div.navigation-menu > button.mat-menu-trigger.actions-button '
      );
      expect(threeDotMenu).toExist();
      expect(threeDotMenu).toHaveDescendant('i.fa.fa-ellipsis-h');
    });
    it('Should remove the 3 dot menu when not docked.', () => {
      //Arrange
      const { spectator, component } = testSetup({
        hasLoaded: true,
        isLoading: false,
        product: { ...mockPresentationProducts[0] },
        presentation: {
          Id: 100,
          Products: mockPresentationProducts,
        } as unknown as Presentation,
      });

      //Assert
      const productNavigation = spectator.query('cos-product-navigation');
      expect(productNavigation).toExist();
      expect(productNavigation).not.toHaveClass('is-docked');

      //Act
      productNavigation.classList.toggle('is-docked', true);
      spectator.detectComponentChanges();

      //Re-Assert
      expect(productNavigation).toHaveClass('is-docked');

      //Act
      productNavigation.classList.toggle('is-docked', false);
      spectator.detectComponentChanges();

      //Re-Assert
      const threeDotMenu = spectator.query(
        '.cos-product-navigation.is-docked .cos-product-navigation-menu'
      );
      expect(threeDotMenu).not.toExist();
    });
    it("should allow a user to see the options 'Save Changes', 'Preview' and 'Cancel' when we click on 3 dot Menu when docked", () => {
      //Arrange
      const { spectator, component } = testSetup({
        hasLoaded: true,
        isLoading: false,
        product: { ...mockPresentationProducts[0] },
        presentation: {
          Id: 100,
          Products: mockPresentationProducts,
        } as unknown as Presentation,
      });

      //Assert
      const productNavigation = spectator.query('cos-product-navigation');
      expect(productNavigation).toExist();
      expect(productNavigation).not.toHaveClass('is-docked');

      //Act
      productNavigation.classList.toggle('is-docked', true);
      spectator.detectComponentChanges();

      //Re-Assert
      expect(productNavigation).toHaveClass('is-docked');
      const threeDotMenu = spectator.query(
        '.cos-product-navigation-menu > div.navigation-menu > button.mat-menu-trigger.actions-button '
      );
      expect(threeDotMenu).toExist();

      //Act
      spectator.click(threeDotMenu);
      spectator.detectComponentChanges();

      const menuItems = spectator.query(
        '.mat-menu-panel.cos-global-menu-panel > div.mat-menu-content'
      ).children;

      //Re-Assert
      expect(menuItems).toExist();
      expect(menuItems.length).toEqual(3);

      expect(menuItems[0]).toHaveText('Save Changes');
      expect(menuItems[0].children[0]).toHaveClass('fas fa-save');

      expect(menuItems[1]).toHaveText('Preview');
      expect(menuItems[1].children[0]).toHaveClass('fas fa-eye');

      expect(menuItems[2]).toHaveText('Cancel');
      expect(menuItems[2].children[0]).toHaveClass('fas fa-times');
    });
  });
  it('should display the presentation product content', () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    const productContent = spectator.query('.presentation-product__pg-content');
    // Assert
    expect(productContent).toBeVisible();
  });

  it('should show the content header', () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    const productContentHeader = spectator.query('.header-style-22');
    // Assert
    expect(productContentHeader).toBeVisible();
  });

  it('should display the Supplier info card', () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    const infoCard = spectator.query('.supplier-info');
    const infoCardComponent = spectator.query('cos-supplier');
    // Assert
    expect(infoCard).toBeVisible();
    expect(infoCardComponent).toBeVisible();
  });

  it("should display the info card caption correctly with text 'All supplier information is hidden from the customer presentation.'", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    const infoCardCaption = spectator.query('.header-style-12-shark.caption');
    const infoCardCaptionIcon = spectator.query(
      '.header-style-12-shark.caption > i'
    );

    // Assert
    expect(infoCardCaption).toBeVisible();
    expect(infoCardCaption).toHaveText(
      'All supplier information is hidden from the customer presentation.'
    );
    expect(infoCardCaption).toHaveDescendant(infoCardCaptionIcon);
    expect(infoCardCaptionIcon).toHaveClass('fa fa-eye-slash');
  });

  it("should display 'Product Details' header", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    const productDetailsHeader = spectator.queryAll('.header-style-18')[0];
    // Assert
    expect(productDetailsHeader).toBeVisible();
    expect(productDetailsHeader).toHaveText('Product Details');
  });

  it("should display the input 'Product Name' label correctly", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const productNameInputLabel = spectator.queryAll(
      'cos-form-field > label'
    )[0];

    // Assert
    expect(productNameInputLabel).toBeVisible();
    expect(productNameInputLabel).toHaveText('Product Name');
  });

  it("should display the input component 'Enter a Product Name' correctly", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const productNameInput = spectator.queryAll(
      'cos-form-field > div > input'
    )[0];

    // Assert
    expect(productNameInput).toBeVisible();
    expect(productNameInput.getAttribute('placeholder')).toEqual(
      'Enter a Product Name'
    );
  });

  it("should display the input 'Summary' label correctly", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const productSummaryInputLabel = spectator.queryAll(
      'cos-form-field > label'
    )[1];

    // Assert
    expect(productSummaryInputLabel).toBeVisible();
    expect(productSummaryInputLabel).toHaveText('Summary');
  });

  it("should display the input component 'Enter a Summary' correctly", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const productDescriptionInput = spectator.query('.product-description');

    // Assert
    expect(productDescriptionInput).toBeVisible();
    expect(productDescriptionInput.getAttribute('placeholder')).toEqual(
      'Enter a Summary'
    );
  });

  it("should display the input 'Note to Customer' label correctly", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const productNoteToCustomerInputLabel = spectator.queryAll(
      'cos-form-field > label'
    )[2];

    // Assert
    expect(productNoteToCustomerInputLabel).toBeVisible();
    expect(productNoteToCustomerInputLabel).toHaveText('Note to Customer');
  });

  it("should display the input component 'Enter a Note to Customer' correctly", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const productNoteToCustomerInput = spectator.query('.customer-note');

    // Assert
    expect(productNoteToCustomerInput).toBeVisible();
    expect(productNoteToCustomerInput.getAttribute('placeholder')).toEqual(
      'Enter a Note to Customer'
    );
  });

  it("should display the 'Product Variants' header correctly", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const productVariantsHeader = spectator.queryAll('.header-style-18')[1];

    // Assert
    expect(productVariantsHeader).toBeVisible();
    expect(productVariantsHeader).toHaveText('Product Variants');
  });

  it('should show Color attribute / variant section when at least one value exist on the product', () => {
    // Arrange
    const { component, spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    component.state.product.Attributes = [
      { Type: 'PRCL' } as PresentationProductAttribute,
    ];
    spectator.detectComponentChanges();

    // Assert
    expect(component.color).toBeTruthy();
  });

  it('should show Size attribute / variant section when at least one value exist on the product', () => {
    // Arrange
    const { component, spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    component.state.product.Attributes = [
      { Type: 'SIZE' } as PresentationProductAttribute,
    ];
    spectator.detectComponentChanges();

    // Assert
    expect(component.size).toBeTruthy();
  });

  it('should show Shape attribute / variant section when at least one value exist on the product', () => {
    // Arrange
    const { component, spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    component.state.product.Attributes = [
      { Type: 'PRSP' } as PresentationProductAttribute,
    ];
    spectator.detectComponentChanges();

    // Assert
    expect(component.shape).toBeTruthy();
  });

  it('should show Material attribute / variant section when at least one value exist on the product', () => {
    // Arrange
    const { component, spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    component.state.product.Attributes = [
      { Type: 'MTRL' } as PresentationProductAttribute,
    ];
    spectator.detectComponentChanges();

    // Assert
    expect(component.material).toBeTruthy();
  });

  it("should display the 'Pricing' header correctly", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const pricingHeader = spectator.queryAll('.header-style-18')[2];

    // Assert
    expect(pricingHeader).toBeVisible();
    expect(pricingHeader).toHaveText('Pricing');
  });

  it("should display 'Adjust all prices based on' control's label correctly", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const adjustPricesControlLabel = spectator.query(
      'cos-form-field.mr-16 > div > span'
    );

    // Assert
    expect(adjustPricesControlLabel).toBeVisible();
    expect(adjustPricesControlLabel).toHaveText('Adjust all prices based on');
  });

  it("should display 'Adjust all prices based on' control correctly, along with correct options", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const adjustPricesControl = spectator.query(
      'cos-form-field.mr-16 > div > select'
    );

    // Assert
    expect(adjustPricesControl).toBeVisible();
    expect(adjustPricesControl.childElementCount).toEqual(3);
    expect(adjustPricesControl.children[0].tagName).toBe('OPTION');
    expect(adjustPricesControl.children[0]).toHaveText('');
    expect(adjustPricesControl.children[1].tagName).toBe('OPTION');
    expect(adjustPricesControl.children[1]).toHaveText('Option 1');
    expect(adjustPricesControl.children[2].tagName).toBe('OPTION');
    expect(adjustPricesControl.children[2]).toHaveText('Option 2');
  });

  it("should display the 'Amount' input's label correctly", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const amountControlLabel = spectator.queryAll(
      'div.mb-32 > div > cos-form-field'
    )[1].children[0].children[0];

    // Assert
    expect(amountControlLabel).toBeVisible();
    expect(amountControlLabel).toHaveText('Amount');
  });

  it("should display the 'Amount' input correctly", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const amountControl = spectator.queryAll(
      'div.mb-32 > div > cos-form-field'
    )[1].children[0].children[1];

    // Assert
    expect(amountControl).toBeVisible();
    expect(amountControl.tagName).toBe('INPUT');
    expect(amountControl.getAttribute('placeholder')).toEqual('Enter amount');
  });

  it('should display the checkbox component to check products', () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const checkbox = spectator.query('.checkbox-products');

    // Assert
    expect(checkbox).toBeVisible();
  });

  it('checkbox to select products ahould not be checked by default', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component.checked).toBeFalsy();
  });

  it("should display the description 'Round up to 2 decimal places' correctly", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const checkbox = spectator.query('.checkbox-products');

    // Assert
    expect(checkbox).toBeVisible();
    expect(checkbox).toHaveText('Round up to 2 decimal places');
  });

  it("should show 'Price Range' toggle along with correct label", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const priceRangeToggle = spectator.queryAll(
      'cos-toggle.block.w-full.mb-16'
    )[1];

    // Assert
    expect(priceRangeToggle).toBeVisible();
    expect(priceRangeToggle.querySelector('span')).toHaveText('Price Range');
  });

  it("should show price range description as 'Price from $18.50 - $42.95'", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const priceRangeDescription = spectator.query('p.header-style-16');

    // Assert
    expect(priceRangeDescription).toBeVisible();
    expect(priceRangeDescription).toHaveText('Price from $18.50 - $42.95');
  });

  it("should show 'Show client discount' toggle along with correct label", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const clientDiscountToggle = spectator.queryAll(
      'cos-toggle.block.w-full.mb-16'
    )[2];

    // Assert
    expect(clientDiscountToggle).toBeVisible();
    expect(clientDiscountToggle.querySelector('span')).toHaveText(
      'Show client discount'
    );
  });

  it("should display the description text as 'Displays an indicator to the customer that the product is discounted for them.'", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const descriptionText = spectator.queryAll('section')[5].children[3];

    // Assert
    expect(descriptionText).toBeVisible();
    expect(descriptionText).toHaveText(
      'Displays an indicator to the customer that the product is discounted for them.'
    );
  });

  it("should display the 'Currency' input's label correctly", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const currencyInputHeader = spectator
      .queryAll('section')[5]
      .querySelectorAll('cos-form-field > div > span')[0];

    // Assert
    expect(currencyInputHeader).toBeVisible();
    expect(currencyInputHeader).toHaveText('Currency');
  });

  it("should display the 'Currency' input correctly, along with correct options", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const currencyInput = spectator
      .queryAll('section')[5]
      .querySelector('cos-form-field > div > select');

    // Assert
    expect(currencyInput).toBeVisible();
    expect(currencyInput.childElementCount).toEqual(3);
    expect(currencyInput.children[0].tagName).toBe('OPTION');
    expect(currencyInput.children[0]).toHaveText('');
    expect(currencyInput.children[1].tagName).toBe('OPTION');
    expect(currencyInput.children[1]).toHaveText('USD');
    expect(currencyInput.children[2].tagName).toBe('OPTION');
    expect(currencyInput.children[2]).toHaveText('CAD');
  });

  it("should display the 'Price Includes' input's label correctly", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const priceIncludesInputHeader = spectator
      .queryAll('section')[5]
      .querySelectorAll('cos-form-field > div > span')[1];

    // Assert
    expect(priceIncludesInputHeader).toBeVisible();
    expect(priceIncludesInputHeader).toHaveText('Price Includes');
  });

  it("should display the 'Price Includes' input correctly", () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
      product: mockPresentationProduct(),
    });

    // Act
    const priceIncludesInput = spectator
      .queryAll('section')[5]
      .querySelector('cos-form-field > div > input');

    // Assert
    expect(priceIncludesInput).toBeVisible();
    expect(priceIncludesInput.getAttribute('id')).toEqual('price-includes');
  });
});
