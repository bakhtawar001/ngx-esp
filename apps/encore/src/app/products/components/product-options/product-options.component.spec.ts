import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  ProductOptionsComponent,
  ProductOptionsComponentModule,
} from './product-options.component';

describe('ProductOptionsComponent', () => {
  let spectator: Spectator<ProductOptionsComponent>;
  const createComponent = createComponentFactory({
    component: ProductOptionsComponent,
    imports: [ProductOptionsComponentModule],
  });

  beforeEach(() => {
    const options: any[] = [];

    spectator = createComponent({
      props: {
        options,
      },
    });
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  it('should check if value is string', () => {
    const stringRes = spectator.component.isString('test');
    const stringArrayRes = spectator.component.isString(['test']);

    expect(stringRes).toBeTruthy();
    expect(stringArrayRes).toBeTruthy();
  });
});
