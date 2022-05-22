import { createComponentFactory } from '@ngneat/spectator';
import { CompanyDecorationsComponent } from './company-decorations.component';

describe('CompanyDecorationsComponent', () => {
  const createComponent = createComponentFactory({
    component: CompanyDecorationsComponent,
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
