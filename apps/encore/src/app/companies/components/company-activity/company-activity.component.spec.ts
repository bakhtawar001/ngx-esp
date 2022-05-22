import { createComponentFactory } from '@ngneat/spectator';
import { CompanyActivityComponent } from './company-activity.component';

describe('CompanyActivityComponent', () => {
  const createComponent = createComponentFactory({
    component: CompanyActivityComponent,
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
