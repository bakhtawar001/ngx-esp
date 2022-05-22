import { dataCySelector } from '@cosmos/testing';
import { createComponentFactory } from '@ngneat/spectator';
import { Product } from '@smartlink/models';
import { ProductsMockDb } from '../../mocks/product.mock';
import { FormatPricePipeModule } from '../../pipes';
import { SponsoredProductPricingComponent } from './sponsored-product-pricing.component';

describe('SponsoredProductPricingComponent', () => {
  const createComponent = createComponentFactory({
    component: SponsoredProductPricingComponent,
    imports: [FormatPricePipeModule],
  });

  const testSetup = () => {
    const mockedProduct = ProductsMockDb.products[0] as Product;
    const spectator = createComponent({
      props: {
        product: mockedProduct,
      },
    });
    spectator.detectComponentChanges();

    return { spectator, component: spectator.component, mockedProduct };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  it('should have the correct name', () => {
    const { mockedProduct, component } = testSetup();

    expect(component.price).toBe(mockedProduct.Variants[0].Prices[0]);
  });

  it('should have a discount price', () => {
    const { component, spectator } = testSetup();
    component.price.DiscountCode = 'DSC_TEXT';
    spectator.detectComponentChanges();

    const productName = spectator.query(
      dataCySelector('sponsored-product-pricing__discount')
    );

    expect(productName).toHaveText('DSC_TEXT');
  });
});
