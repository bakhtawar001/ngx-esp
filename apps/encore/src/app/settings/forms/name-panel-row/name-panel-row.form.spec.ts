import { HttpClientTestingModule } from '@angular/common/http/testing';
import { dataCySelector } from '@cosmos/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';
import {
  NamePanelRowForm,
  NamePanelRowFormModule,
} from './name-panel-row.form';
import { NAME_PANEL_LOCAL_STATE } from './name-panel-row.local-state';

const selectors = {
  toggleEditButton: dataCySelector('action-button'),
  cancelButton: dataCySelector('cancel-button'),
  saveButton: dataCySelector('save-button'),
  title: dataCySelector('title'),
  current: dataCySelector('current-state'),
  firstName: {
    label: dataCySelector('first-name-label'),
    input: dataCySelector('first-name-input'),
  },
  lastName: {
    label: dataCySelector('last-name-label'),
    input: dataCySelector('last-name-input'),
  },
};
const initialName = 'Test Name';

describe('NamePanelRowForm', () => {
  const createComponent = createComponentFactory({
    component: NamePanelRowForm,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      NamePanelRowFormModule,
    ],
    providers: [
      {
        provide: NAME_PANEL_LOCAL_STATE,
        useValue: {
          connect: () =>
            of({
              data: { Name: initialName },
            }),
          data: { Name: initialName },
        },
      },
    ],
  });

  const testSetup = (options?: { isUser?: boolean }) => {
    const spectator = createComponent();

    spectator.setInput('isUser', options?.isUser);
    spectator.detectComponentChanges();

    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  it('should contain title', () => {
    const { spectator } = testSetup();
    const title = spectator.query(selectors.title);

    expect(title).toBeTruthy();
    expect(title.textContent.trim()).toEqual('Name');
  });

  describe('Cancel button', () => {
    it('should contain cancel button', () => {
      const { spectator } = testSetup();
      toggleEditMode(spectator);

      const cancelButton = spectator.query(selectors.cancelButton);
      expect(cancelButton).toBeTruthy();
      expect(cancelButton.textContent.trim()).toEqual('Cancel');
      expect(cancelButton.getAttribute('disabled')).toBeFalsy();
    });

    it('should restore data to previous state', () => {
      const { spectator, component } = testSetup();
      toggleEditMode(spectator);

      spectator.typeInElement('Another Test', selectors.firstName.input);
      spectator.click(selectors.cancelButton);
      spectator.detectComponentChanges();

      expect(component.state.data.Name).toEqual(initialName);
      expect(spectator.query(selectors.firstName.input)).toBeFalsy();
      expect(spectator.query(selectors.lastName.input)).toBeFalsy();
    });
  });

  describe('First name', () => {
    it('should contain label', () => {
      const { spectator } = testSetup();

      toggleEditMode(spectator);

      const firstNameLabel = spectator.query(selectors.firstName.label);
      expect(firstNameLabel).toBeTruthy();
      expect(firstNameLabel.textContent.trim()).toEqual('First Name');
    });

    it('should contain input', () => {
      const { spectator } = testSetup();

      toggleEditMode(spectator);

      const firstNameInput = spectator.query(selectors.firstName.input);
      expect(firstNameInput).toBeTruthy();
      expect(firstNameInput.getAttribute('maxlength')).toEqual('50');
    });

    describe('Is user flag', () => {
      it('should mark first name as invalid when isUser is true and special character was typed', () => {
        const { spectator, component } = testSetup({ isUser: true });
        toggleEditMode(spectator);

        spectator.typeInElement('#--123', selectors.firstName.input);
        spectator.detectComponentChanges();

        expect(component.form.controls.GivenName.valid).toBeFalsy();
      });

      it('should not mark first name as invalid when isUser is false and special character was typed', () => {
        const { spectator, component } = testSetup({ isUser: false });
        toggleEditMode(spectator);

        spectator.typeInElement('#--123', selectors.firstName.input);
        spectator.detectComponentChanges();

        expect(component.form.controls.GivenName.valid).toBeTruthy();
      });
    });

    it('should display error when first name is empty', () => {
      const { spectator, component } = testSetup();
      toggleEditMode(spectator);

      const control = component.form.get('GivenName');
      control.setValue(' ');
      expect(control.valid).toBeFalsy();
    });
  });

  describe('Last name', () => {
    it('should contain label', () => {
      const { spectator } = testSetup();

      toggleEditMode(spectator);

      const lastNameLabel = spectator.query(selectors.lastName.label);
      expect(lastNameLabel).toBeTruthy();
      expect(lastNameLabel.textContent.trim()).toEqual('Last Name');
    });

    it('should contain input', () => {
      const { spectator } = testSetup();

      toggleEditMode(spectator);

      const lastNameInput = spectator.query(selectors.lastName.input);
      expect(lastNameInput).toBeTruthy();
      expect(lastNameInput.getAttribute('maxlength')).toEqual('50');
    });

    describe('Is user flag', () => {
      it('should mark last name as invalid when isUser is true and special character was typed', () => {
        const { spectator, component } = testSetup({ isUser: true });
        toggleEditMode(spectator);

        spectator.typeInElement('#--123', selectors.lastName.input);
        spectator.detectComponentChanges();

        expect(component.form.controls.FamilyName.valid).toBeFalsy();
      });

      it('should not mark last name as invalid when isUser is false and special character was typed', () => {
        const { spectator, component } = testSetup({ isUser: false });
        toggleEditMode(spectator);

        spectator.typeInElement('#--123', selectors.lastName.input);
        spectator.detectComponentChanges();

        expect(component.form.controls.FamilyName.valid).toBeTruthy();
      });
    });

    it('should display error when last name is empty', () => {
      const { spectator, component } = testSetup();
      toggleEditMode(spectator);

      const control = component.form.get('FamilyName');
      control.setValue(' ');

      expect(control.valid).toBeFalsy();
    });
  });
});

function toggleEditMode(spectator: Spectator<NamePanelRowForm>): void {
  spectator.click(selectors.toggleEditButton);
}
