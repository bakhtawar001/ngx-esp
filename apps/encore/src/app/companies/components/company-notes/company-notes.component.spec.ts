import { createComponentFactory } from '@ngneat/spectator';
import { CompanyNotesComponent } from './company-notes.component';

describe('CompanyNotesComponent', () => {
  const createComponent = createComponentFactory({
    component: CompanyNotesComponent,
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
