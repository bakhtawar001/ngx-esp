import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ProductsMockDb } from '@smartlink/products/mocks';
import { CosCartListComponent } from './cart-list.component';
import { CosCartListModule } from './cart-list.module';

const products = ProductsMockDb.products.slice(0, 4);

describe('CosCartListComponent', () => {
  let component: CosCartListComponent;
  let spectator: Spectator<CosCartListComponent>;
  const createComponent = createComponentFactory({
    component: CosCartListComponent,
    imports: [CosCartListModule],
  });
  beforeEach(() => {
    spectator = createComponent({
      props: {
        heading: 'tee shirts',
        products,
      },
    });
    component = spectator.component;
  });

  it('should exist', () => {
    expect(spectator.query('.cos-cart-list')).toBeTruthy();
  });
});
