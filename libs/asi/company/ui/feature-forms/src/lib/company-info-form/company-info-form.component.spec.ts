import { fakeAsync } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@cosmos/forms';
import {
  AsiCompanyAddressFormComponent,
  AsiCompanyAddressFormComponentModule,
} from '../company-address-form';
import { ConfirmDialogService } from '@asi/ui/feature-core';
import { dataCySelector } from '@cosmos/testing';
import { CompaniesService } from '@esp/companies';
import {
  EspLookupSelectComponent,
  EspLookupSelectComponentModule,
} from '@esp/lookup-types';
import {
  byText,
  createComponentFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import {
  AsiCompanyInfoFormComponent,
  AsiCompanyInfoFormComponentModule,
} from './company-info-form.component';

const errors = {
  rolesError: dataCySelector('roles-error'),
};
const company = {
  label: dataCySelector('company-label'),
  input: dataCySelector('company-input'),
};
const primaryContactName = {
  label: dataCySelector('primary-contact-name-label'),
  firstName: dataCySelector('primary-contact-first-name'),
  lastName: dataCySelector('primary-contact-last-name'),
};
const primaryContactEmail = {
  label: dataCySelector('primary-contact-email-label'),
  email: dataCySelector('primary-contact-email-input'),
};
const role = {
  label: dataCySelector('role-label'),
};
const phone = {
  label: dataCySelector('phone-label'),
  autocomplete: dataCySelector('phone-autocomplete'),
};
const address = {
  form: dataCySelector('address-form'),
};

describe('CompanyInfoFormComponent', () => {
  const createComponent = createComponentFactory({
    component: AsiCompanyInfoFormComponent,
    imports: [AsiCompanyInfoFormComponentModule],
    providers: [
      mockProvider(ConfirmDialogService),
      mockProvider(CompaniesService),
    ],
    overrideModules: [
      [
        EspLookupSelectComponentModule,
        {
          set: {
            declarations: [MockComponent(EspLookupSelectComponent)],
            exports: [MockComponent(EspLookupSelectComponent)],
          },
        },
      ],
      [
        AsiCompanyAddressFormComponentModule,
        {
          set: {
            declarations: [MockComponent(AsiCompanyAddressFormComponent)],
            exports: [MockComponent(AsiCompanyAddressFormComponent)],
          },
        },
      ],
    ],
    detectChanges: false,
  });

  const testSetup = () => {
    const spectator = createComponent();
    const component = spectator.component;

    component.form = new FormGroup({
      Name: new FormControl(''),
      GivenName: new FormControl(''),
      FamilyName: new FormControl(''),
      IsCustomer: new FormControl(false),
      IsDecorator: new FormControl(false),
      IsSupplier: new FormControl(false),
      PrimaryEmail: new FormGroup({
        Type: new FormControl(null),
        Address: new FormControl(null),
      }),
      Address: new FormGroup({}),
      Phone: new FormGroup({
        Type: new FormControl(null),
        Number: new FormControl(null),
      }),
      IsAcknowledgementContact: new FormControl(false),
      IsBillingContact: new FormControl(false),
      IsShippingContact: new FormControl(false),
    }) as any;

    spectator.detectChanges();

    return { spectator, component };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  describe('Company options', () => {
    it('should have company type "Customer" ', () => {
      //Arrange
      const { component } = testSetup();
      //Assert
      expect(component.companyRoles.map((c) => c.name)).toContain('Customer');
    });

    it('should have company type "Supplier" ', () => {
      //Arrange
      const { component } = testSetup();

      //Assert
      expect(component.companyRoles.map((c) => c.name)).toContain('Supplier');
    });

    it('should have company type "Decorator" ', () => {
      //Arrange
      const { component } = testSetup();

      //Assert
      expect(component.companyRoles.map((c) => c.name)).toContain('Decorator');
    });

    it('should have company types in order Customer, Supplier, Decorator ', () => {
      //Arrange
      const { component } = testSetup();

      //Assert
      expect(component.companyRoles.map((c) => c.name)).toStrictEqual([
        'Customer',
        'Supplier',
        'Decorator',
      ]);
    });
  });

  describe('Company roles', () => {
    it('should show company type "Supplier" checkbox', () => {
      //Arrange
      const { spectator, component } = testSetup();
      const role_name = 'Supplier';
      const checkbox = spectator.query(
        byText(role_name, {
          selector: `.cos-checkbox-label`,
        })
      );
      expect(checkbox).toBeVisible();
      expect(component.form.value.IsSupplier).toBeFalsy();

      //Act
      spectator.click(checkbox!);
      spectator.detectChanges();

      //Assert
      expect(component.form.value.IsSupplier).toBeTruthy();
    });

    it('should show company type "Decorator" checkbox', () => {
      //Arrange
      const { component, spectator } = testSetup();
      const role_name = 'Decorator';
      const checkbox = spectator.query(
        byText(role_name, {
          selector: `.cos-checkbox-label`,
        })
      );
      expect(checkbox).toBeVisible();
      expect(component.form.value.IsDecorator).toBeFalsy();

      //Act
      spectator.click(checkbox!);
      spectator.detectChanges();

      //Assert
      expect(component.form.value.IsDecorator).toBeTruthy();
    });

    it('should show company type "Customer" checkbox', () => {
      //Arrange
      const { spectator, component } = testSetup();
      const role_name = 'Customer';
      const checkbox = spectator.query(
        byText(role_name, {
          selector: `.cos-checkbox-label`,
        })
      );
      expect(checkbox).toBeVisible();
      expect(component.form.value.IsCustomer).toBeFalsy();

      //Act
      spectator.click(checkbox!);
      spectator.detectChanges();

      //Assert
      expect(component.form.value.IsCustomer).toBeTruthy();
    });

    it('should show error if none of the company type checkboxes are selected', () => {
      //Arrange
      const { spectator, component } = testSetup();

      component.form.setErrors({
        requireCheckboxesToBeChecked: true,
      });

      spectator.detectComponentChanges();

      //Assert
      expect(spectator.query(errors.rolesError)).toBeTruthy();
      expect(spectator.query(errors.rolesError)).toHaveText(
        'Please select at least one Company type.'
      );
    });
  });

  describe('Company name search', () => {
    it('should show company name input field', fakeAsync(() => {
      //Arrange
      const { spectator, component } = testSetup();
      const companiesService = spectator.inject(CompaniesService);
      const companyNameInput = spectator.query('.company-name-input');
      expect(companyNameInput).toExist();
      expect(companyNameInput?.tagName).toBe('INPUT');
      const spyFunc = jest.spyOn(companiesService, 'exists');
      spyFunc.mockReturnValue(of(false));

      //Act
      spectator.typeInElement('test', companyNameInput!);
      companyNameInput?.dispatchEvent(new Event('blur'));
      spectator.detectChanges();
      spectator.tick(500);

      //Assert
      expect(component.form.get('Name')?.value).toBe('test');
      expect(spyFunc).toHaveBeenCalledWith('test');
    }));

    it('should company name input field have maxlength 50', () => {
      //Arrange
      const { spectator } = testSetup();
      const companyNameInput = spectator.query('.company-name-input');

      //Assert
      expect(companyNameInput).toHaveAttribute('maxlength', '50');
    });

    it('should disable Next until /companies/exist/name validate that the company is a duplicate is checked', fakeAsync(() => {
      //Arrange
      const { spectator, component } = testSetup();
      const companiesService = spectator.inject(CompaniesService);
      const confirmDialogService = spectator.inject(ConfirmDialogService);
      const companyNameInput = spectator.query('.company-name-input');
      jest.spyOn(confirmDialogService, 'confirm').mockReturnValue(of(true));
      const spyFunc = jest.spyOn(companiesService, 'exists');
      spyFunc.mockReturnValue(of(true));

      //Act
      spectator.typeInElement('test', companyNameInput!);
      companyNameInput?.dispatchEvent(new Event('blur'));
      spectator.detectChanges();
      spectator.tick(500);

      //Assert
      expect(component.form.get('Name')?.value).toBe('test');
      expect(spyFunc).toHaveBeenCalledWith('test');
    }));

    it('should enable Next when duplicate company check is False indicating that the company name is unique to this tenant', fakeAsync(() => {
      //Arrange
      const { spectator, component } = testSetup();
      const companiesService = spectator.inject(CompaniesService);
      const confirmDialogService = spectator.inject(ConfirmDialogService);
      const companyNameInput = spectator.query('.company-name-input');
      jest.spyOn(confirmDialogService, 'confirm').mockReturnValue(of(true));
      const spyFunc = jest.spyOn(companiesService, 'exists');
      spyFunc.mockReturnValue(of(true));

      //Act
      spectator.typeInElement('test', companyNameInput!);
      companyNameInput?.dispatchEvent(new Event('blur'));
      spectator.detectChanges();
      spectator.tick(500);

      //Assert
      expect(component.form.get('Name')?.value).toBe('test');
      expect(spyFunc).toHaveBeenCalledWith('test');
    }));

    it("should when duplicate company check is True display a message window  “[Company name] already exists. Do you want to create a duplicate record?”  Yes or No'", fakeAsync(() => {
      //Arrange
      const { spectator, component } = testSetup();
      const companiesService = spectator.inject(CompaniesService);
      const confirmDialogService = spectator.inject(ConfirmDialogService);
      const companyNameInput = spectator.query('.company-name-input');
      jest.spyOn(confirmDialogService, 'confirm').mockReturnValue(of(true));
      const spyFunc = jest.spyOn(companiesService, 'exists');
      spyFunc.mockReturnValue(of(true));

      //Act
      spectator.typeInElement('test', companyNameInput!);
      companyNameInput?.dispatchEvent(new Event('blur'));
      spectator.detectChanges();
      spectator.tick(500);

      //Assert
      expect(component.form.get('Name')?.value).toBe('test');
      expect(confirmDialogService.confirm).toHaveBeenCalledWith({
        message: `${component.form?.controls.Name?.value} already exists. Do you want to create a duplicate record?`,
        confirm: 'Yes',
        cancel: 'No',
      });
    }));

    it('should show duplicate company name confirmation popup and select yes', fakeAsync(() => {
      //Arrange
      const { spectator, component } = testSetup();
      const companiesService = spectator.inject(CompaniesService);
      const confirmDialogService = spectator.inject(ConfirmDialogService);
      const companyNameInput = spectator.query('.company-name-input');
      jest.spyOn(confirmDialogService, 'confirm').mockReturnValue(of(true));
      const spyFunc = jest.spyOn(companiesService, 'exists');
      spyFunc.mockReturnValue(of(true));

      //Act
      spectator.typeInElement('test', companyNameInput!);
      companyNameInput?.dispatchEvent(new Event('blur'));
      spectator.detectChanges();
      spectator.tick(500);

      //Assert
      expect(component.form.get('Name')?.value).toBe('test');
      expect(confirmDialogService.confirm).toHaveBeenCalled();
      expect(spyFunc).toHaveBeenCalledWith('test');
    }));

    it('should show duplicate company name confirmation popup and select No', fakeAsync(() => {
      //Arrange
      const { spectator, component } = testSetup();
      const companiesService = spectator.inject(CompaniesService);
      const confirmDialogService = spectator.inject(ConfirmDialogService);
      let companyNameInput = spectator.query('.company-name-input');
      jest.spyOn(confirmDialogService, 'confirm').mockReturnValue(of(false));
      const spyFunc = jest.spyOn(companiesService, 'exists');
      spyFunc.mockReturnValue(of(true));

      //Act
      spectator.typeInElement('test', companyNameInput!);
      companyNameInput?.dispatchEvent(new Event('blur'));
      spectator.detectChanges();
      spectator.tick(500);
      companyNameInput = spectator.query('.company-name-input');

      //Assert
      expect(component.form.get('Name')?.value).toBe('test');
      expect(confirmDialogService.confirm).toHaveBeenCalled();
      expect(companyNameInput).toBeFocused();
      expect(spyFunc).toHaveBeenCalledWith('test');
    }));
  });

  describe('Company Telephone Number Info', () => {
    it("should show label header as 'Phone'", () => {
      // Arrange
      const { spectator } = testSetup();
      const telephoneHeader = spectator.queryAll('.cos-form-label')[3];

      // Assert
      expect(telephoneHeader).toExist();
      expect(telephoneHeader).toHaveText('Phone (optional)');
    });
  });

  describe('Company Name', () => {
    it('should display label', () => {
      const { spectator } = testSetup();
      expect(spectator.query(company.label)).toBeTruthy();
      expect(spectator.query(company.label)?.textContent).toEqual(
        'Company Name'
      );
    });

    it('should contain input', () => {
      const { spectator } = testSetup();
      expect(spectator.query(company.input)).toBeTruthy();
    });

    it('should display placeholder', () => {
      const { spectator } = testSetup();
      expect(
        spectator.query(company.input)?.getAttribute('placeholder')
      ).toEqual('Enter company name');
    });

    it('should allow up to 50 characters to be entered and will stop input on 51st character', () => {
      const { spectator } = testSetup();
      expect(spectator.query(company.input)?.getAttribute('maxlength')).toEqual(
        '50'
      );
    });

    it('should display the Company Name field as a required field with * and show standard validation when blur from the field and it is empty', () => {
      const { spectator, component } = testSetup();

      spectator.typeInElement('', company.input);
      spectator.detectChanges();

      expect(component.form.invalid).toBe(true);
    });
  });

  describe('Primary Contacts Name', () => {
    it('should display label', () => {
      const { spectator } = testSetup();
      expect(spectator.query(primaryContactName.label)).toBeTruthy();
      expect(
        spectator.query(primaryContactName.label)?.textContent?.trim()
      ).toEqual("Primary Contact's Name  *");
    });

    it('should contain input for first name', () => {
      const { spectator } = testSetup();
      expect(spectator.query(primaryContactName.firstName)).toBeTruthy();
    });

    it('should display placeholder for first name', () => {
      const { spectator } = testSetup();
      expect(
        spectator
          .query(primaryContactName.firstName)
          ?.getAttribute('placeholder')
      ).toEqual('Enter first name');
    });

    it('should allow up to 50 characters for first name and will stop input on 51st character', () => {
      const { spectator } = testSetup();
      expect(
        spectator.query(primaryContactName.firstName)?.getAttribute('maxlength')
      ).toEqual('50');
    });

    it('should show standard validation when blur from the first name field is empty', () => {
      const { spectator, component } = testSetup();

      spectator.typeInElement('', primaryContactName.firstName);
      spectator.detectChanges();

      expect(component.form.invalid).toBe(true);
    });

    it('should contain input for last name', () => {
      const { spectator } = testSetup();
      expect(spectator.query(primaryContactName.lastName)).toBeTruthy();
    });

    it('should display placeholder for last name', () => {
      const { spectator } = testSetup();
      expect(
        spectator.query(primaryContactName.lastName).getAttribute('placeholder')
      ).toEqual('Enter last name');
    });

    it('should allow up to 50 characters for last name and will stop input on 51st character', () => {
      const { spectator } = testSetup();
      expect(
        spectator.query(primaryContactName.lastName)?.getAttribute('maxlength')
      ).toEqual('50');
    });
  });

  describe('Primary Contacts Email', () => {
    it('should display label', () => {
      const { spectator } = testSetup();
      expect(spectator.query(primaryContactEmail.label)).toBeTruthy();
      expect(spectator.query(primaryContactEmail.label)?.textContent).toEqual(
        "Primary Contact's Email (optional)"
      );
    });

    it('should contain optional input', () => {
      const { spectator } = testSetup();
      expect(spectator.query(primaryContactEmail.email)).toBeTruthy();
    });

    it('should display placeholder', () => {
      const { spectator } = testSetup();
      expect(
        spectator.query(primaryContactEmail.email)?.getAttribute('placeholder')
      ).toEqual('Enter email address');
    });

    it('should allow up to 100 characters for email address and will stop input on 101st character', () => {
      const { spectator } = testSetup();
      expect(
        spectator.query(primaryContactEmail.email)?.getAttribute('maxlength')
      ).toEqual('100');
    });
  });

  describe('Role', () => {
    it('should display label', () => {
      const { spectator } = testSetup();
      expect(spectator.query(role.label)).toBeTruthy();
      expect(spectator.query(role.label)?.textContent?.trim()).toEqual(
        'Role (optional)'
      );
    });

    it('should contain checkbox for order approver', () => {
      const { spectator } = testSetup();
      const role_name = 'Order Approver';
      const checkbox = spectator.query(
        byText(role_name, {
          selector: `.cos-checkbox-label`,
        })
      );

      expect(checkbox).toBeTruthy();
    });

    it('should contain checkbox for billing', () => {
      const { spectator } = testSetup();
      const role_name = 'Billing';
      const checkbox = spectator.query(
        byText(role_name, {
          selector: `.cos-checkbox-label`,
        })
      );

      expect(checkbox).toBeTruthy();
    });

    it('should contain checkbox for shipping', () => {
      const { spectator } = testSetup();
      const role_name = 'Shipping';
      const checkbox = spectator.query(
        byText(role_name, {
          selector: `.cos-checkbox-label`,
        })
      );

      expect(checkbox).toBeTruthy();
    });
  });

  describe('Phone', () => {
    it('should display label', () => {
      const { spectator } = testSetup();
      expect(spectator.query(phone.label)).toBeTruthy();
      expect(spectator.query(phone.label)?.textContent?.trim()).toEqual(
        'Phone (optional)'
      );
    });

    it('should contain autocomplete field', () => {
      const { spectator } = testSetup();
      expect(spectator.query(phone.autocomplete)).toBeTruthy();
    });
  });

  describe('Address', () => {
    it('should display address form', () => {
      const { spectator } = testSetup();
      expect(spectator.query(address.form)).toBeTruthy();
    });
  });
});
