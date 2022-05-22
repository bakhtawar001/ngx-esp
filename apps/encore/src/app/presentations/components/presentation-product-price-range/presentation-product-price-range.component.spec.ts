import { createComponentFactory } from '@ngneat/spectator/jest';
import {
  PresentationProductPriceRangeComponent,
  PresentationProductPriceRangeComponentModule,
} from './presentation-product-price-range.component';

describe('Presentation Product Price Range Component', () => {
  const createComponent = createComponentFactory({
    component: PresentationProductPriceRangeComponent,
    imports: [PresentationProductPriceRangeComponentModule],
    providers: [],
  });

  const testSetup = () => {
    const spectator = createComponent();
    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });
});
