import { createComponentFactory } from '@ngneat/spectator';
import { CompanyProductHistoryComponent } from './company-product-history.component';

describe('CompanyProductHistoryComponent', () => {
  const createComponent = createComponentFactory({
    component: CompanyProductHistoryComponent,
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
