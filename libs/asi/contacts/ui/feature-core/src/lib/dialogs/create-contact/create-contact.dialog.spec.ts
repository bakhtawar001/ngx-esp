import {
  CreateContactDialog,
  CreateContactDialogModule,
} from './create-contact.dialog';
import { createComponentFactory } from '@ngneat/spectator';
import { mockProvider } from '@ngneat/spectator/jest';
import { ConfirmDialogService } from '@asi/ui/feature-core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { EMPTY } from 'rxjs';
import { NgxsModule } from '@ngxs/store';
import { dataCySelector } from '@cosmos/testing';

const selectors = {
  header: dataCySelector('header'),
  subHeader: dataCySelector('sub-header'),
  contentHeader: dataCySelector('content-header'),
  firstName: {
    label: dataCySelector('first-name-label'),
    input: dataCySelector('first-name-input'),
    error: dataCySelector('first-name-error'),
  },
  lastName: {
    label: dataCySelector('last-name-label'),
    input: dataCySelector('last-name-input'),
    error: dataCySelector('last-name-error'),
  },
  email: {
    label: dataCySelector('email-label'),
    input: dataCySelector('email-input'),
    error: dataCySelector('email-error'),
  },
  company: {
    label: dataCySelector('company-label'),
    titleInput: dataCySelector('company-title-input'),
    autocomplete: dataCySelector('company-autocomplete'),
  },
  phone: {
    label: dataCySelector('phone-label'),
    input: dataCySelector('phone-input'),
  },
  website: {
    label: dataCySelector('website-label'),
    input: dataCySelector('website-input'),
    error: dataCySelector('website-error'),
  },
  address: {
    form: dataCySelector('address-form'),
  },
  buttons: {
    cancel: dataCySelector('cancel-button'),
    submit: dataCySelector('submit-button'),
  },
};

describe('CreateContactComponent', () => {
  const createComponent = createComponentFactory({
    component: CreateContactDialog,
    imports: [CreateContactDialogModule, NgxsModule.forRoot()],
  });

  const testSetup = () => {
    const spectator = createComponent({
      providers: [
        mockProvider(MatDialogRef, {
          backdropClick: () => EMPTY,
        }),
        mockProvider(MatDialog),
        mockProvider(ConfirmDialogService),
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    });
    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  it('should display proper header title', () => {
    const { spectator } = testSetup();
    expect(spectator.query(selectors.header)?.innerHTML.trim()).toBe(
      'Create Contact'
    );
  });

  it('should display proper sub header title', () => {
    const { spectator } = testSetup();
    expect(spectator.query(selectors.subHeader)?.innerHTML.trim()).toBe(
      'Fill out the required fields below to add a contact. Additional information can be added later.'
    );
  });

  it('should display proper content header title', () => {
    const { spectator } = testSetup();
    expect(spectator.query(selectors.contentHeader)?.innerHTML.trim()).toBe(
      'Contact Information'
    );
  });

  describe('First name', () => {
    it('First name label', () => {
      const { spectator } = testSetup();
      const firstNameLabel = spectator.query(selectors.firstName.label);
      expect(firstNameLabel?.innerHTML.trim()).toBe('First Name');
      expect(firstNameLabel?.nextSibling?.textContent?.trim()).toBe('*');
    });

    describe('First name field', () => {
      it('should be required', () => {
        const { spectator } = testSetup();
        expect(
          spectator
            .query(selectors.firstName.input)
            ?.attributes.getNamedItem('required')
        ).toExist();
      });

      it('should have attribute maxlength', () => {
        const { spectator } = testSetup();
        expect(
          spectator.query(selectors.firstName.input)?.getAttribute('maxlength')
        ).toEqual('50');
      });

      it('should show error when invalid', () => {
        const { spectator } = testSetup();
        spectator.typeInElement('', selectors.firstName.input);
        spectator.blur(selectors.firstName.input);
        expect(spectator.query(selectors.firstName.error)).toBeVisible();
      });

      it('form field should be invalid when name is not provided', () => {
        const { spectator, component } = testSetup();
        spectator.typeInElement('', selectors.firstName.input);
        spectator.blur(selectors.firstName.input);
        expect(
          component.presenter.form.controls.FamilyName.invalid
        ).toBeTruthy();
      });

      it('should not show error when valid', () => {
        const { spectator } = testSetup();
        spectator.typeInElement('valid', selectors.firstName.input);
        spectator.blur(selectors.firstName.input);
        expect(spectator.query(selectors.firstName.error)).not.toBeVisible();
      });

      it('form field should be valid when name is provided', () => {
        const { spectator, component } = testSetup();
        spectator.typeInElement('valid', selectors.firstName.input);
        spectator.blur(selectors.firstName.input);
        spectator.detectComponentChanges();
        expect(component.presenter.form.controls.GivenName.valid).toBeTruthy();
      });
    });
  });

  describe('Last Name', () => {
    it('First name label', () => {
      const { spectator } = testSetup();
      const lastNameLabel = spectator.query(selectors.lastName.label);
      expect(lastNameLabel?.innerHTML.trim()).toBe('Last Name');
      expect(lastNameLabel?.nextSibling?.textContent?.trim()).toBe('*');
    });

    describe('Last name field', () => {
      it('should be required', () => {
        const { spectator } = testSetup();
        expect(
          spectator
            .query(selectors.lastName.input)
            ?.attributes.getNamedItem('required')
        ).toExist();
      });

      it('should have attribute maxlength', () => {
        const { spectator } = testSetup();
        expect(
          spectator.query(selectors.lastName.input)?.getAttribute('maxlength')
        ).toEqual('50');
      });

      it('should show error when invalid', () => {
        const { spectator } = testSetup();
        spectator.typeInElement('', selectors.lastName.input);
        spectator.blur(selectors.lastName.input);
        expect(spectator.query(selectors.lastName.error)).toBeVisible();
      });

      it('form field should be invalid when name is not provided', () => {
        const { spectator, component } = testSetup();
        spectator.typeInElement('', selectors.lastName.input);
        spectator.blur(selectors.lastName.input);
        expect(
          component.presenter.form.controls.FamilyName.invalid
        ).toBeTruthy();
      });

      it('should not show error when valid', () => {
        const { spectator } = testSetup();
        spectator.typeInElement('valid', selectors.lastName.input);
        spectator.blur(selectors.lastName.input);
        spectator.detectComponentChanges();
        expect(spectator.query(selectors.lastName.error)).not.toBeVisible();
      });

      it('form control should be valid when name is provided', () => {
        const { spectator, component } = testSetup();
        spectator.typeInElement('valid', selectors.lastName.input);
        spectator.blur(selectors.lastName.input);
        expect(component.presenter.form.controls.FamilyName.valid).toBeTruthy();
      });
    });
  });

  describe('Email', () => {
    it('should display label', () => {
      const { spectator } = testSetup();
      expect(spectator.query(selectors.email.label)).toBeTruthy();
      expect(spectator.query(selectors.email.label)?.textContent).toEqual(
        'Email (optional)'
      );
    });

    it('should contain optional input', () => {
      const { spectator } = testSetup();
      expect(spectator.query(selectors.email.input)).toBeTruthy();
    });

    it('should display placeholder', () => {
      const { spectator } = testSetup();
      expect(
        spectator.query(selectors.email.input)?.getAttribute('placeholder')
      ).toEqual('Enter email address');
    });

    it('should allow up to 100 characters for email address and will stop input on 101st character', () => {
      const { spectator } = testSetup();
      expect(
        spectator.query(selectors.email.input)?.getAttribute('maxlength')
      ).toEqual('100');
    });

    it('should show error when email is invalid', () => {
      const { spectator } = testSetup();
      spectator.typeInElement('emailinvalid', selectors.email.input);
      spectator.blur(selectors.email.input);
      expect(spectator.query(selectors.email.error)).toBeVisible();
    });

    it('should not show error when email is valid', () => {
      const { spectator } = testSetup();
      spectator.typeInElement('email@valid.com', selectors.email.input);
      spectator.blur(selectors.email.input);
      expect(spectator.query(selectors.email.error)).not.toBeVisible();
    });

    it('form field should be invalid when wrong email is provided', () => {
      const { spectator, component } = testSetup();
      spectator.typeInElement('email@valid.com', selectors.email.input);
      spectator.blur(selectors.email.input);
      expect(
        component.presenter.form.controls.PrimaryEmail?.valid
      ).toBeTruthy();
    });

    it('form control should be valid when email is provided', () => {
      const { spectator, component } = testSetup();
      spectator.typeInElement('valid', selectors.email.input);
      spectator.blur(selectors.email.input);
      expect(
        component.presenter.form.controls.PrimaryEmail?.invalid
      ).toBeTruthy();
    });
  });

  describe('Company', () => {
    it('should display label', () => {
      const { spectator } = testSetup();
      expect(spectator.query(selectors.company.label)).toBeTruthy();
      expect(spectator.query(selectors.company.label)?.textContent).toEqual(
        'Company (optional)'
      );
    });

    it('should contain autocomplete', () => {
      const { spectator } = testSetup();
      expect(spectator.query(selectors.company.autocomplete)).toBeTruthy();
    });

    it('should contain input', () => {
      const { spectator } = testSetup();
      expect(spectator.query(selectors.company.titleInput)).toBeTruthy();
    });

    it('should display title placeholder', () => {
      const { spectator } = testSetup();
      expect(
        spectator
          .query(selectors.company.titleInput)
          ?.getAttribute('placeholder')
      ).toEqual('Title');
    });

    it('should allow up to 50 characters for email address and will stop input on 51st character', () => {
      const { spectator } = testSetup();
      expect(
        spectator.query(selectors.company.titleInput)?.getAttribute('maxlength')
      ).toEqual('50');
    });
  });

  describe('Phone', () => {
    it('should display label', () => {
      const { spectator } = testSetup();
      expect(spectator.query(selectors.phone.label)).toBeTruthy();
      expect(
        spectator.query(selectors.phone.label)?.textContent?.trim()
      ).toEqual('Phone (optional)');
    });

    it('should contain optional input', () => {
      const { spectator } = testSetup();
      expect(spectator.query(selectors.phone.input)).toBeTruthy();
    });

    it('should display placeholder', () => {
      const { spectator } = testSetup();
      expect(
        spectator.query(selectors.phone.input)?.getAttribute('placeholder')
      ).toEqual('Enter phone number');
    });

    it('should allow up to 30 characters for email address and will stop input on 31st character', () => {
      const { spectator } = testSetup();
      expect(
        spectator.query(selectors.phone.input)?.getAttribute('maxlength')
      ).toEqual('30');
    });
  });

  describe('Website', () => {
    it('should display label', () => {
      const { spectator } = testSetup();
      expect(spectator.query(selectors.website.label)).toBeTruthy();
      expect(spectator.query(selectors.website.label)?.textContent).toEqual(
        'Website (optional)'
      );
    });

    it('should contain optional input', () => {
      const { spectator } = testSetup();
      expect(spectator.query(selectors.website.input)).toBeTruthy();
    });

    it('should display placeholder', () => {
      const { spectator } = testSetup();
      expect(
        spectator.query(selectors.website.input)?.getAttribute('placeholder')
      ).toEqual('Enter website address');
    });

    it('should allow up to 100 characters for email address and will stop input on 101st character', () => {
      const { spectator } = testSetup();
      expect(
        spectator.query(selectors.website.input)?.getAttribute('maxlength')
      ).toEqual('100');
    });

    it('should show error when website is invalid', () => {
      const { spectator } = testSetup();
      spectator.typeInElement('test', selectors.website.input);
      spectator.blur(selectors.website.input);
      expect(spectator.query(selectors.website.error)).toBeVisible();
    });

    it('should not show error when website is valid', () => {
      const { spectator } = testSetup();
      spectator.typeInElement('www.test.com', selectors.website.input);
      spectator.blur(selectors.website.input);
      expect(spectator.query(selectors.website.error)).not.toBeVisible();
    });

    it('form field should be invalid when wrong email is provided', () => {
      const { spectator, component } = testSetup();
      spectator.typeInElement('www.test.com', selectors.website.input);
      spectator.blur(selectors.website.input);
      expect(component.presenter.form.controls.Website?.valid).toBeTruthy();
    });

    it('form control should be valid when email is provided', () => {
      const { spectator, component } = testSetup();
      spectator.typeInElement('invalid', selectors.website.input);
      spectator.blur(selectors.website.input);
      expect(component.presenter.form.controls.Website?.invalid).toBeTruthy();
    });
  });

  describe('Address', () => {
    it('should display form', () => {
      const { spectator } = testSetup();
      expect(spectator.query(selectors.address.form)).toBeTruthy();
    });
  });

  describe('Actions', () => {
    it('should display two buttons', () => {
      const { spectator } = testSetup();
      expect(spectator.query(selectors.buttons.cancel)).toBeTruthy();
      expect(spectator.query(selectors.buttons.submit)).toBeTruthy();
    });

    it('submit should be disabled when from is invalid', () => {
      const { spectator, component } = testSetup();
      expect(component.presenter.form.invalid).toBeTruthy();
      expect(spectator.query(selectors.buttons.submit)).toBeDisabled();
    });

    it('should call onCancel and close dialog when click cancel button', () => {
      const { spectator, component } = testSetup();
      const onCancelSpy = jest.spyOn(component, 'onCancel');
      const dialogRefCloseSpy = jest.spyOn(component['_dialogRef'], 'close');
      spectator.click(selectors.buttons.cancel);
      expect(onCancelSpy).toHaveBeenCalled();
      expect(dialogRefCloseSpy).toHaveBeenCalled();
    });

    it('submit should be enabled when from is valid', () => {
      const { spectator } = testSetup();
      spectator.typeInElement('test', selectors.firstName.input);
      spectator.typeInElement('test', selectors.lastName.input);
      expect(spectator.query(selectors.buttons.submit)).not.toBeDisabled();
    });

    it('should call onCreate and close dialog when click submit button', () => {
      const { spectator, component } = testSetup();
      const onCreateSpy = jest.spyOn(component, 'onCreate');
      const dialogRefCloseSpy = jest.spyOn(component['_dialogRef'], 'close');
      spectator.typeInElement('test', selectors.firstName.input);
      spectator.typeInElement('test', selectors.lastName.input);
      spectator.click(selectors.buttons.submit);
      expect(onCreateSpy).toHaveBeenCalled();
      expect(dialogRefCloseSpy).toHaveBeenCalledWith(
        component['mapContactFormToContact'](component.presenter.form.value)
      );
    });
  });
});
