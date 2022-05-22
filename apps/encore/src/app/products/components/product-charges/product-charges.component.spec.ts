import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AttributeValueType } from '@smartlink/models';
import {
  ProductChargesComponent,
  ProductChargesComponentModule,
} from './product-charges.component';

describe('ProductChargesComponent', () => {
  let spectator: Spectator<ProductChargesComponent>;
  const createComponent = createComponentFactory({
    component: ProductChargesComponent,
    imports: [ProductChargesComponentModule],
  });

  beforeEach(() => {
    const attributes: AttributeValueType[] = [];

    spectator = createComponent({
      props: {
        attributes,
      },
    });
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
