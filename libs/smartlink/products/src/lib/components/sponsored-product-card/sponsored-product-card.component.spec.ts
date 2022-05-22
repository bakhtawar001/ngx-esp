import { dataCySelector } from '@cosmos/testing';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { Product } from '@smartlink/models';
import { ProductsMockDb } from '../../mocks/product.mock';
import { SponsoredProductCardComponent } from './sponsored-product-card.component';

describe('SponsoredProductCardComponent', () => {
  const createComponent = createComponentFactory({
    component: SponsoredProductCardComponent,
    shallow: true,
  });

  const testSetup = (props?: { product?: Partial<Product> }) => {
    const mockedProduct = ProductsMockDb.products[0] as Product;
    const spectator = createComponent({
      props: {
        product: { ...mockedProduct, ...props?.product },
      },
    });
    spectator.detectComponentChanges();

    return {
      spectator,
      component: spectator.component,
      mockedProduct,
    };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  it('should have an attributes component', () => {
    const { spectator } = testSetup();

    const productCardTagsSelector = spectator.query('cos-product-card-tags');

    expect(productCardTagsSelector).toExist();
  });

  describe('each product should have', () => {
    it('Product Image', () => {
      const { spectator } = testSetup();

      const element = spectator.query('esp-product-image');

      expect(element).toExist();
    });

    it('Product Name', () => {
      const { mockedProduct, spectator } = testSetup();

      const productName = spectator.query(
        dataCySelector('sponsored-product-card__product-name')
      );

      expect(productName).toHaveText(mockedProduct.Name);
    });

    it('Product Number', () => {
      const { mockedProduct, spectator } = testSetup();

      const productNumber = spectator.query(
        dataCySelector('sponsored-product-card__product-number')
      );

      expect(productNumber).toHaveText(mockedProduct.Number);
    });

    it('Product Summary', () => {
      const { mockedProduct, spectator } = testSetup();

      const productShortDesc = spectator.query(
        dataCySelector('sponsored-product-card__product-short-desc')
      );

      expect(productShortDesc).toHaveText(mockedProduct.ShortDescription);
    });

    it('Product Price', () => {
      const { spectator } = testSetup();

      const element = spectator.query('esp-sponsored-product-pricing');

      expect(element).toExist();
    });

    it('Add to Collection Button', () => {
      // Arrange
      const { spectator, component } = testSetup();

      const element = spectator.query(
        dataCySelector('sponsored-product-card__add-to-collection')
      );
      const emitSpy = jest.spyOn(component.addToCollectionClick, 'emit');

      spectator.click(element);

      // Assert
      expect(emitSpy).toHaveBeenCalled();
      expect(element).toHaveText('Add to Collection');
    });
  });

  it('user should be able to click on Product Image and emit an event', () => {
    // Arrange
    const { spectator, component } = testSetup();
    const productDetailClick = jest.spyOn(component.productDetailClick, 'emit');

    const element = spectator.query(
      dataCySelector('sponsored-product-card__product-image-link')
    );

    spectator.click(element);

    // Assert
    expect(productDetailClick).toHaveBeenCalled();
  });

  it('user should be able to click on Product Name and emit an event', () => {
    // Arrange
    const { spectator, component } = testSetup();
    const productDetailClick = jest.spyOn(component.productDetailClick, 'emit');

    const element = spectator.query(
      dataCySelector('sponsored-product-card__product-name')
    );

    spectator.click(element);

    // Assert
    expect(productDetailClick).toHaveBeenCalled();
  });
});
