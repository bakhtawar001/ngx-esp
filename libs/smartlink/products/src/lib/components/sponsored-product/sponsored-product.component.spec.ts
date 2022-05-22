import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { ProductsService } from '../../services';
import { SponsoredProductComponent } from './sponsored-product.component';

describe('SponsoredProductComponent', () => {
  const createComponent = createComponentFactory({
    component: SponsoredProductComponent,
    providers: [mockProvider(ProductsService)],
  });

  const testSetup = () => {
    const spectator = createComponent({
      props: {
        productId: 1,
      },
    });
    spectator.detectComponentChanges();

    const productsService = spectator.inject(ProductsService, true);

    return { spectator, component: spectator.component, productsService };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  it('should get a product from service', () => {
    const { productsService } = testSetup();

    const productsServiceSpyFn = jest.spyOn(productsService, 'get');

    expect(productsServiceSpyFn).toHaveBeenCalled();
  });
});
