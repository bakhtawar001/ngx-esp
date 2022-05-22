import { HttpClientTestingModule } from '@angular/common/http/testing';
import { dataCySelector } from '@cosmos/testing';
import { Email } from '@esp/models';
import { PARTY_LOCAL_STATE, PartyLocalState } from '@esp/parties';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';
import {
  EmailListPanelRowForm,
  EmailListPanelRowFormModule,
} from './email-list-panel-row.form';

const selectors = {
  header: {
    title: '.settings-two-col-1 .form-row-title',
    value: '.settings-two-col-1 .form-row-value',
    icon: 'i.form-row-icon',
  },
  actionButton: dataCySelector('action-button'),
  cancelButton: dataCySelector('cancel-button'),
  saveButton: dataCySelector('save-button'),
  form: {
    emailInput: dataCySelector('email-address'),
  },
  view: {
    address: dataCySelector('email-address'),
    type: dataCySelector('email-type'),
    primaryPill: dataCySelector('email-primary'),
  },
};

describe('EmailListPanelRowForm', () => {
  const createComponent = createComponentFactory({
    component: EmailListPanelRowForm,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      EmailListPanelRowFormModule,
    ],
  });

  const testSetup = (options?: { emails?: Partial<Email>[] }) => {
    const partyLocalStateMock = {
      connect: () =>
        of({
          party: {
            Emails: options?.emails ?? [],
            IsEditable: true,
          },
        } as any),
      party: {
        IsEditable: true,
      },
      partyIsReady: true,
    };

    const spectator = createComponent({
      providers: [
        mockProvider(PartyLocalState, partyLocalStateMock),
        { provide: PARTY_LOCAL_STATE, useValue: partyLocalStateMock },
      ],
    });

    spectator.detectComponentChanges();

    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    //Arrange
    const { component } = testSetup();

    //Assert
    expect(component).toBeTruthy();
  });

  it('should show "Email" as title and "No email addresses added"', () => {
    //Arrange
    const { spectator } = testSetup();
    const title = spectator.query(selectors.header.title);
    const value = spectator.query(selectors.header.value);

    //Assert
    expect(title.textContent).toMatch('Email');
    expect(value.textContent).toMatch('No email addresses added');
  });

  it('should show error message "The email address is invalid" when email is invalid', () => {
    const { spectator, component } = testSetup();
    toggleEditMode(spectator);

    const addresses = component.getFormArray('Emails');
    const control = addresses.at(0).get('Address');

    control.setValue('invalidemail');

    expect(control.errors.valid).toBeFalsy();
  });

  it('should show @ icon', () => {
    const { spectator } = testSetup();

    expect(spectator.query(selectors.header.icon).classList).toContain('fa-at');
  });

  describe('Cancel button', () => {
    it('should be displayed when adding or editing', () => {
      const { spectator } = testSetup();
      toggleEditMode(spectator);

      expect(spectator.query(selectors.cancelButton)).toBeTruthy();
      expect(
        spectator.query(selectors.cancelButton).textContent.trim()
      ).toEqual('Cancel');
    });

    it('should revert changes when clicking cancel', () => {
      const { spectator } = testSetup({ emails: [{ Address: 'g@g.com' }] });
      toggleEditMode(spectator);

      spectator.typeInElement('test@test.com', selectors.form.emailInput);
      spectator.click(selectors.cancelButton);
      spectator.detectChanges();

      expect(
        spectator.query(selectors.view.address).textContent.trim()
      ).toEqual('g@g.com');
    });
  });

  describe('Save button', () => {
    it('should be displayed in add/edit mode', () => {
      const { spectator } = testSetup();
      toggleEditMode(spectator);

      expect(spectator.query(selectors.saveButton)).toBeTruthy();
    });

    it('should be disabled if form is invalid', () => {
      const { spectator } = testSetup();
      toggleEditMode(spectator);

      expect(
        spectator.query(selectors.saveButton).getAttribute('disabled')
      ).toBeTruthy();
    });

    it('should be enabled if form is valid', () => {
      const { spectator } = testSetup();
      toggleEditMode(spectator);

      spectator.typeInElement('g@g.com', selectors.form.emailInput);

      expect(
        spectator.query(selectors.saveButton).getAttribute('disabled')
      ).toBeFalsy();
    });
  });

  describe('View mode', () => {
    it('should display email type and address', () => {
      const { spectator } = testSetup({
        emails: [{ Type: 'Work', Address: 'g@g.com' }],
      });

      const type = spectator.query(selectors.view.type);
      expect(type).toBeTruthy();
      expect(type.textContent.trim()).toEqual('Work:');
      const address = spectator.query(selectors.view.address);
      expect(address).toBeTruthy();
      expect(address.textContent.trim()).toEqual('g@g.com');
    });

    it('should display email address as a link to send the email', () => {
      const { spectator } = testSetup({
        emails: [{ Type: 'Work', Address: 'g@g.com' }],
      });

      expect(
        spectator.query(selectors.view.address).getAttribute('href')
      ).toContain('mailto:');
    });
  });
});

function toggleEditMode(spectator: Spectator<EmailListPanelRowForm>): void {
  spectator.click(selectors.actionButton);
}
