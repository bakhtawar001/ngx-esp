import { createComponentFactory } from '@ngneat/spectator';
import { ContactNotesComponent } from './contact-notes.component';

describe('ContactNotesComponent', () => {
  const createComponent = createComponentFactory({
    component: ContactNotesComponent,
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
