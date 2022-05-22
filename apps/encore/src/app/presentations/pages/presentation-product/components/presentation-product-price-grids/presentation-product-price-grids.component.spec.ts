import { createComponentFactory } from '@ngneat/spectator/jest';
import {
  PresentationProductPriceGridsComponent,
  PresentationProductPriceGridsModule,
} from './presentation-product-price-grids.component';

xdescribe('PresentationProductPriceGridsComponent', () => {
  const createComponent = createComponentFactory({
    component: PresentationProductPriceGridsComponent,
    imports: [PresentationProductPriceGridsModule],
    providers: [],
  });

  const testSetup = () => {
    const spectator = createComponent();
    return { component: spectator.component, spectator };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it("should display the text 'Add a price grid or customize your price range.' correctly, when price grids is not present", () => {
    // Arrange
    const { spectator, component } = testSetup();

    // Act
    spectator.detectComponentChanges();
    const descText = spectator.query('.presentation-product-price-grids > p');

    // Assert
    expect(descText).toBeVisible();
    expect(descText).toHaveText(
      'Add a price grid or customize your price range.'
    );
  });

  it("should display the header 'Price Grid' correctly", () => {
    // Arrange
    const { spectator } = testSetup();
    const header = spectator.query('.presentation-product-price-grids > h3');

    // Assert
    expect(header).toBeVisible();
    expect(header).toHaveText('Price Grid');
  });

  describe('Price grid accordion', () => {
    it('should display the price grid accordion(s) correctly', () => {
      // Arrange
      const { component, spectator } = testSetup();
      const priceGridAccordions = spectator.queryAll(
        '.presentation-product-price-grids > cos-accordion'
      );

      // Assert
      expect(priceGridAccordions).toBeVisible();
      expect(priceGridAccordions).toHaveLength(
        component.visiblePriceGrids.length
      );
    });

    it("should display the accordion title text as 'N01 White, XS, X, M, L,'", () => {
      // Arrange
      const { spectator } = testSetup();
      const priceGridAccordionTitle = spectator
        .queryAll('.presentation-product-price-grids > cos-accordion')[0]
        .querySelector('p.text-body-shark-12');

      // Assert
      expect(priceGridAccordionTitle).toBeVisible();
      expect(priceGridAccordionTitle).toHaveText('N01 White, XS, X, M, L,');
    });

    it('should display Price grid table correctly', () => {
      // Arrange
      const { spectator } = testSetup();
      const priceGridAccordionTable = spectator
        .queryAll('.presentation-product-price-grids > cos-accordion')[0]
        .querySelector('cos-table');

      // Assert
      expect(priceGridAccordionTable).toBeVisible();
    });
  });

  it('should display the Presentation Product Card', () => {
    // Arrange
    const { spectator } = testSetup();
    const presentationProductCard = spectator.queryAll(
      '.presentation-product-price-grids > cos-card'
    )[0];

    // Assert
    expect(presentationProductCard).toBeVisible();
  });

  it("should display the presentation product card header as 'Add Price Grids'", () => {
    // Arrange
    const { spectator } = testSetup();
    const presentationProductCardHeader = spectator
      .query('.presentation-product-price-grids > cos-card')
      .querySelector('span');

    // Assert
    expect(presentationProductCardHeader).toBeVisible();
    expect(presentationProductCardHeader).toHaveText('Add Price Grids');
  });

  it("should display the text 'Available price grids are hidden from the customer presentation until they are added.' along with icon, correctly", () => {
    // Arrange
    const { spectator } = testSetup();
    const descriptionText = spectator.query('p.body-style-12-shark');
    const descriptionTextIcon = descriptionText.querySelector('i');

    // Assert
    expect(descriptionText).toBeVisible();
    expect(descriptionText).toHaveDescendant(descriptionTextIcon);
    expect(descriptionText).toHaveText(
      'Available price grids are hidden from the customer presentation until they are added.'
    );
    expect(descriptionTextIcon).toHaveClass('fa fa-eye-slash mr-8');
  });

  it("should display the text 'Recommended based on variant selection' correctly", () => {
    // Arrange
    const { spectator } = testSetup();
    const descriptionText = spectator
      .query('.presentation-product-price-grids > cos-card')
      .querySelector('p.header-style-16');

    // Assert
    expect(descriptionText).toBeVisible();
    expect(descriptionText).toHaveText(
      'Recommended based on variant selection'
    );
  });

  it('should display the presentation product card table correctly', () => {
    // Arrange
    const { spectator } = testSetup();
    const presentationProductCardTable = spectator
      .query('.presentation-product-price-grids > cos-card')
      .querySelector('cos-table');

    // Assert
    expect(presentationProductCardTable).toBeVisible();
  });

  it("should display the 'Generate recommendations' button correctly along with icon", () => {
    // Arrange
    const { spectator } = testSetup();
    const generateRecommendationsBtn = spectator.queryAll(
      '.presentation-product-btn'
    )[0];
    const generateRecommendationsBtnIcon =
      generateRecommendationsBtn.querySelector('i');

    // Assert
    expect(generateRecommendationsBtn).toBeVisible();
    expect(generateRecommendationsBtn).toHaveDescendant(
      generateRecommendationsBtnIcon
    );
    expect(generateRecommendationsBtn).toHaveText('Generate recommendations');
    expect(generateRecommendationsBtnIcon).toHaveClass('fa fa-redo');
  });

  it("should display 'All Price Grids' header correctly", () => {
    // Arrange
    const { spectator } = testSetup();
    const allPricesHeader = spectator.queryAll('p.header-style-16')[1];

    // Assert
    expect(allPricesHeader).toBeVisible();
    expect(allPricesHeader).toHaveText('All Price Grids');
  });

  it('should display the All prices grid table correctly', () => {
    // Arrange
    const { spectator } = testSetup();
    const allPricesGridTable = spectator
      .query('.presentation-product-price-grids > cos-card')
      .querySelectorAll('cos-table')[1];

    // Assert
    expect(allPricesGridTable).toBeVisible();
  });

  it("should display the 'Add all price grids' button correctly along with icon", () => {
    // Arrange
    const { spectator } = testSetup();
    const allPriceGridsBtn = spectator.queryAll('.presentation-product-btn')[1];
    const allPriceGridsBtnIcon = allPriceGridsBtn.querySelector('i');

    // Assert
    expect(allPriceGridsBtn).toBeVisible();
    expect(allPriceGridsBtn).toHaveDescendant(allPriceGridsBtnIcon);
    expect(allPriceGridsBtn).toHaveText('Add all price grids');
    expect(allPriceGridsBtnIcon).toHaveClass('fa fa-plus');
  });
});
