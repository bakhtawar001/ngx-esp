import { createComponentFactory } from '@ngneat/spectator';
import { CompanyArtworkComponent } from './company-artwork.component';

describe('CompanyArtworkComponent', () => {
  const createComponent = createComponentFactory({
    component: CompanyArtworkComponent,
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
