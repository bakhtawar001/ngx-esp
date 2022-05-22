import { ContactDialogService } from '@asi/contacts/ui/feature-core';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { ContactSearchLocalState } from '../../local-states';
import {
  ContactsActionsBarComponent,
  ContactsActionsBarComponentModule,
} from './contacts-actions-bar.component';
import { dataCySelector } from '@cosmos/testing';

const selectors = {
  createContactButton: dataCySelector('create-contact-button'),
};

describe('ContactsActionsBarComponent', () => {
  const createComponent = createComponentFactory({
    component: ContactsActionsBarComponent,
    imports: [ContactsActionsBarComponentModule],
  });

  const testSetup = () => {
    const spectator = createComponent({
      providers: [mockProvider(ContactSearchLocalState)],
    });
    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  it('should display the 3 dot menu button', () => {
    // Arrange
    const { spectator } = testSetup();
    const actionsBtn = spectator.query('.actions-button');

    // Assert
    expect(actionsBtn).toExist();
    expect(actionsBtn).toHaveDescendant('.fa.fa-ellipsis-h');
  });

  it('should display create contact button', () => {
    // Arrange
    const { spectator } = testSetup();
    expect(spectator.query(selectors.createContactButton)).toBeVisible();
  });

  it('should call state.createContact on click create contact button', () => {
    // Arrange
    const { spectator, component } = testSetup();
    const createContactSpy = jest.spyOn(component, 'createContact');
    const stateSpy = jest.spyOn(component.state, 'createContact');

    spectator.click(selectors.createContactButton);
    expect(createContactSpy).toHaveBeenCalled();
    expect(stateSpy).toHaveBeenCalled();
  });
});
