import { createComponentFactory } from '@ngneat/spectator/jest';
import {
  PresentationProductChargesTableComponent,
  PresentationProductChargesTableComponentModule,
} from './presentation-product-charges-table.component';

describe('Presentation Product Charges Component', () => {
  const createComponent = createComponentFactory({
    component: PresentationProductChargesTableComponent,
    imports: [PresentationProductChargesTableComponentModule],
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
