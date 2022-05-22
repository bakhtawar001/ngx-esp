import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { Product } from '@smartlink/models';
import { ProductsMockDb } from '@smartlink/products/mocks';
import {
  ProductMatrixComponent,
  ProductMatrixComponentModule,
} from './product-matrix.component';

describe('ProductMatrixComponent', () => {
  let spectator: Spectator<ProductMatrixComponent>;
  let product: Product;
  const createComponent = createComponentFactory({
    component: ProductMatrixComponent,
    imports: [ProductMatrixComponentModule],
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

  it('should have product options', () => {
    spectator.detectChanges();
    expect(spectator.component.getProductOptions()).toBeTruthy();
  });

  it('should update product pricing on criteria change', () => {
    spectator.component.criteriaChange('ValueName', 'Test');
    spectator.detectChanges();
    expect(spectator.component.productPricing).not.toBeEmpty();
  });

  it('should be available', () => {
    const availability = spectator.component.getAvailabilityForValue(
      'ValueName',
      'test'
    );
    spectator.detectChanges();
    expect(availability).toBeDefined();
  });

  it('should have filter for opposite option', () => {
    const selectedValue =
      spectator.component.getOppositeOptionFilter('ValueName');
    spectator.detectChanges();
    expect(selectedValue).toBeDefined();
  });
});
