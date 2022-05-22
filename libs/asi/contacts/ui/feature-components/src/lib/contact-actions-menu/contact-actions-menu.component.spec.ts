import { dataCySelector } from '@cosmos/testing';
import { Contact } from '@esp/models';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import {
  AsiContactActionsMenuComponent,
  AsiContactActionsMenuModule,
} from './contact-actions-menu.component';
import { ContactActionsMenuLocalState } from './contact-actions-menu.local-state';

const selectors = {
  menuContainer: dataCySelector('menu-container'),
  menuTrigger: dataCySelector('menu-trigger'),
  transferOwnershipButton: dataCySelector('transfer-ownership-button'),
  makeActiveButton: dataCySelector('make-active-button'),
  makeInactiveButton: dataCySelector('make-inactive-button'),
  deleteContactButton: dataCySelector('delete-button'),
};

describe('AsiContactActionsMenuComponent', () => {
  const createComponent = createComponentFactory({
    component: AsiContactActionsMenuComponent,
    imports: [AsiContactActionsMenuModule],
  });

  const testSetup = (options?: { contact: Partial<Contact> }) => {
    const spectator = createComponent({
      providers: [
        mockProvider(ContactActionsMenuLocalState, {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          transferOwnership: () => {},
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          makeActive: () => {},
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          makeInactive: () => {},
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          deleteContact: () => {},
        }),
      ],
    });

    if (options?.contact) {
      spectator.setInput({
        contact: options?.contact as Contact,
      });
    }

    spectator.detectComponentChanges();

    const component = spectator.component;
    const state = spectator.inject(ContactActionsMenuLocalState, true);

    return { spectator, component, state };
  };

  it('should create', () => {
    const { spectator } = testSetup();

    expect(spectator).toBeTruthy();
  });

  it('should not be visible if contact is not editable', () => {
    const { spectator } = testSetup();

    expect(spectator.query(selectors.menuContainer)).toBeFalsy();
    expect(spectator.query(selectors.menuTrigger)).toBeFalsy();
  });

  it('should be visible if contact is editable', () => {
    const { spectator } = testSetup({ contact: { IsEditable: true } });

    expect(spectator.query(selectors.menuContainer)).toBeTruthy();
    expect(spectator.query(selectors.menuTrigger)).toBeTruthy();
  });

  describe('Transfer ownership', () => {
    it('should be visible', () => {
      const { spectator } = testSetup({ contact: { IsEditable: true } });

      openMenu(spectator);

      const button = spectator.query(
        selectors.transferOwnershipButton
      ) as HTMLElement;
      expect(button).toBeVisible();
      expect(button.textContent?.trim()).toEqual('Transfer Ownership');
    });

    it('should call local state method', () => {
      const { spectator, state } = testSetup({ contact: { IsEditable: true } });
      jest.spyOn(state, 'transferOwnership');
      openMenu(spectator);

      spectator.click(selectors.transferOwnershipButton);

      expect(state.transferOwnership).toHaveBeenCalled();
    });
  });

  describe('Make active', () => {
    it('should be visible when contact is inactive', () => {
      const { spectator } = testSetup({
        contact: { IsEditable: true, IsActive: false },
      });

      openMenu(spectator);

      const button = spectator.query(selectors.makeActiveButton);
      expect(button).toBeVisible();
    });

    it('should not be visible when contact is active', () => {
      const { spectator } = testSetup({
        contact: { IsEditable: true, IsActive: true },
      });

      openMenu(spectator);

      const button = spectator.query(selectors.makeActiveButton);
      expect(button).not.toBeVisible();
    });

    it('should call local state method', () => {
      const { spectator, state } = testSetup({
        contact: { IsEditable: true, IsActive: false },
      });
      jest.spyOn(state, 'makeActive');
      openMenu(spectator);

      spectator.click(selectors.makeActiveButton);

      expect(state.makeActive).toHaveBeenCalled();
    });
  });

  describe('Make inactive', () => {
    it('should be visible when contact is active', () => {
      const { spectator } = testSetup({
        contact: { IsEditable: true, IsActive: true },
      });

      openMenu(spectator);

      const button = spectator.query(selectors.makeInactiveButton);
      expect(button).toBeVisible();
    });

    it('should not be visible when contact is inactive', () => {
      const { spectator } = testSetup({
        contact: { IsEditable: true, IsActive: false },
      });

      openMenu(spectator);

      const button = spectator.query(selectors.makeInactiveButton);
      expect(button).not.toBeVisible();
    });

    it('should call local state method', () => {
      const { spectator, state } = testSetup({
        contact: { IsEditable: true, IsActive: true },
      });
      jest.spyOn(state, 'makeInactive');
      openMenu(spectator);

      spectator.click(selectors.makeInactiveButton);

      expect(state.makeInactive).toHaveBeenCalled();
    });
  });

  describe('Delete contact', () => {
    it('should be visible', () => {
      const { spectator } = testSetup({
        contact: { IsEditable: true },
      });
      openMenu(spectator);

      expect(spectator.query(selectors.deleteContactButton)).toBeVisible();
    });

    it('should call local state method', () => {
      const { spectator, state } = testSetup({
        contact: { IsEditable: true },
      });
      jest.spyOn(state, 'deleteContact');
      openMenu(spectator);

      spectator.click(selectors.deleteContactButton);

      expect(state.deleteContact).toHaveBeenCalled();
    });
  });
});

function openMenu(spectator: Spectator<AsiContactActionsMenuComponent>): void {
  spectator.click(selectors.menuTrigger);
}
