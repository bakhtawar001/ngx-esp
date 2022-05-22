import { createComponentFactory } from '@ngneat/spectator/jest';
import {
  PresentationProductPricingComponent,
  PresentationProductPricingComponentModule,
} from './presentation-product-pricing.component';

describe('Presentation Product Pricing Component', () => {
  const createComponent = createComponentFactory({
    component: PresentationProductPricingComponent,
    imports: [PresentationProductPricingComponentModule],
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
