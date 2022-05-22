import { AuthFacade } from '@esp/auth';
import { CompaniesService } from '@esp/companies';
import { ContactsService } from '@esp/contacts';
import { FilesService } from '@esp/files';
import { CompaniesMockDb } from '@esp/__mocks__/companies';
import {
  byText,
  createComponentFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import { CompanyDetailLocalState } from '../../local-states';
import {
  CompanyNameRowForm,
  CompanyNameRowFormModule,
} from './company-name-row.form';

const company = CompaniesMockDb.Companies[0];

describe('CompanyNameRowForm', () => {
  const createComponent = createComponentFactory({
    component: CompanyNameRowForm,
    imports: [CompanyNameRowFormModule],
    providers: [
      mockProvider(CompanyDetailLocalState),
      mockProvider(CompaniesService),
      mockProvider(ContactsService),
      mockProvider(FilesService),
      mockProvider(AuthFacade, {
        user: {
          hasRole: (role) => true,
        },
      }),
    ],
  });

  const testSetup = (options?: { isEditable?: boolean; Name?: string }) => {
    const spectator = createComponent({
      providers: [
        mockProvider(CompanyDetailLocalState, <
          Partial<CompanyDetailLocalState>
        >{
          isLoading: false,
          type: 'company',
          connect() {
            return of(this);
          },
          party: {
            ...company,
            Name: options?.Name || company.Name,
            IsEditable: options?.isEditable || false,
          },
        }),
      ],
    });
    const component = spectator.component;
    return { spectator, component };
  };
  it('should create', () => {
    // Arrange
    const { component, spectator } = testSetup();

    // Assert
    expect(component).toBeTruthy();
    expect(spectator).toBeTruthy;
  });

  it('should display the row icon', () => {
    // Arrange
    const { spectator } = testSetup();
    const icon = spectator.query('.form-row-icon');

    // Assert
    expect(icon).toExist();
    expect(icon).toHaveClass('fa fa-sign');
  });

  it('should display form row title', () => {
    // Arrange
    const { spectator } = testSetup();
    const formRowTitle = spectator.query('.form-row-title');

    // Assert
    expect(formRowTitle).toBeVisible();
    expect(formRowTitle).toHaveText('Company Display Name');
  });

  it('should display form row value', () => {
    // Arrange
    const value = 'test';
    const { spectator } = testSetup({ Name: value });
    const formRowValue = spectator.query('.form-row-value');

    // Assert
    expect(formRowValue).toBeVisible();
    expect(formRowValue).toHaveText(value);
  });

  it('should not display Edit button if restricted', () => {
    // Arrange
    const { spectator } = testSetup({ isEditable: false });

    const editButton = spectator.query('.cos-button');

    //Assert
    expect(editButton).not.toBeVisible();
  });

  describe('company display name control', () => {
    it('should show initial value', () => {
      // Arrange
      const { spectator, component } = testSetup();
      const intial_value = 'initial_val';
      const companiesService = spectator.inject(CompaniesService);
      jest.spyOn(companiesService, 'exists').mockReturnValue(of(false));

      // Act
      component.control.setValue(intial_value);
      spectator.detectChanges();

      // Assert
      expect(component.control).toExist();
      expect(component.control.value).toEqual(intial_value);
    });

    describe('edit mode', () => {
      it('should open row in edit state', () => {
        // Arrange
        const { spectator } = testSetup({ isEditable: true });
        const editButton = spectator.query('.cos-button');

        // Act
        spectator.click(editButton);
        const editPanelContainer = spectator.query('.panel-editable-row');

        // Assert
        expect(editPanelContainer).toBeVisible();
      });

      it('should display company display name label', () => {
        // Arrange
        const { spectator } = testSetup({ isEditable: true });
        const editButton = spectator.query('.cos-button');

        // Act
        spectator.click(editButton);
        const label = spectator.query('.cos-form-field-label');

        // Assert
        expect(label).toBeVisible();
      });

      it('should display company display name field and has a placeholder value of company display name ', () => {
        // Arrange
        const { spectator } = testSetup({ isEditable: true });
        const editButton = spectator.query('.cos-button');

        // Act
        spectator.click(editButton);
        const inputEl = spectator.query('input#companyDisplayName');

        // Assert
        expect(inputEl).toExist();
        expect(inputEl).toBeVisible();
        expect(inputEl).toHaveAttribute('placeholder', 'Company Display Name');
      });

      it('should allow maximum of 50 character in company display name field', () => {
        // Arrange
        const { spectator, component } = testSetup({ isEditable: true });
        const editButton = spectator.query('.cos-button');

        // Act
        spectator.click(editButton);
        const inputEl = spectator.query('input#companyDisplayName');

        const companiesService = spectator.inject(CompaniesService);
        jest.spyOn(companiesService, 'exists').mockReturnValue(of(false));
        component.control.setValue(
          'This is very very long text. This is very very long text. This is very very long text. This is very very long text. This is very very long text.'
        );
        spectator.detectChanges();

        // Assert
        expect(inputEl).toHaveAttribute('maxlength', '50');
        expect(component.control.valid).toBeFalsy();
        expect(component.control.errors.maxlength).toBeTruthy();
      });

      it('should display empty field message', () => {
        // Arrange
        const { spectator, component } = testSetup({ isEditable: true });
        const editButton = spectator.query('.cos-button');

        // Act
        spectator.click(editButton);
        const inputEl = spectator.query('input#companyDisplayName');

        spectator.typeInElement('', inputEl);
        inputEl.dispatchEvent(new Event('blur'));

        spectator.detectChanges();

        const errorEl = spectator.query('.cos-error');

        // Assert
        expect(errorEl).toBeVisible();
        expect(component.control.valid).toBeFalsy();
        expect(component.control.errors.required).toBeTruthy();
      });
    });

    it('should disabled save button when company display name is empty', () => {
      // Arrange
      const { spectator } = testSetup({ isEditable: true });
      const editButton = spectator.query('.cos-button');

      // Act
      spectator.click(editButton);
      const inputEl = spectator.query('input#companyDisplayName');

      spectator.typeInElement('', inputEl);
      inputEl.dispatchEvent(new Event('blur'));
      spectator.detectChanges();
      const saveBtn = spectator.query('.cos-flat-button.cos-primary');

      // Assert
      expect(saveBtn).toExist();
      expect(saveBtn.tagName).toBe('BUTTON');
      expect(saveBtn).toHaveClass('cos-button-disabled');
    });

    it('should disabled save button when company display name is not changed', () => {
      // Arrange
      const companyName = 'test company';
      const { spectator, component } = testSetup({ isEditable: true });
      const editButton = spectator.query('.cos-button');

      // Act
      spectator.click(editButton);
      const inputEl = spectator.query('input#companyDisplayName');

      const companiesService = spectator.inject(CompaniesService);
      jest.spyOn(companiesService, 'exists').mockReturnValue(of(false));
      component.control.setValue(companyName);
      spectator.detectChanges();

      spectator.typeInElement(companyName, inputEl);
      inputEl.dispatchEvent(new Event('blur'));
      spectator.detectChanges();
      const saveBtn = spectator.query('.cos-flat-button.cos-primary');

      // Assert
      expect(saveBtn).toExist();
      expect(saveBtn.tagName).toBe('BUTTON');
      expect(saveBtn).toHaveClass('cos-button-disabled');
    });

    it('should display duplicate error', () => {
      // Arrange
      const { spectator, component } = testSetup();

      // Act
      const companiesService = spectator.inject(CompaniesService);
      const spyFunc = jest
        .spyOn(companiesService, 'exists')
        .mockReturnValue(of(true));
      component.control.setValue('test');
      spectator.detectChanges();

      // Assert
      expect(component.control.value).toEqual('test');
      expect(spyFunc).toHaveBeenCalled();
      expect(spyFunc).toHaveBeenCalledWith('test');
      expect(component.control.errors.duplicate).toBeTruthy();
    });

    describe('actions in edit mode', () => {
      it('should show previous value on cancel', () => {
        //Arrange
        const initialVal = 'test company';
        const newVal = 'test company update';
        const { component, spectator } = testSetup({
          isEditable: true,
        });
        const companiesService = spectator.inject(CompaniesService);
        jest.spyOn(companiesService, 'exists').mockReturnValue(of(false));

        //Act
        component.control.setValue(initialVal);
        spectator.detectComponentChanges();

        const editButton = spectator.query(
          byText('Edit', {
            selector: 'button[cos-button]',
          })
        );

        spectator.click(editButton);
        component.control.setValue(newVal);

        const cancelButton = spectator.query(
          byText('Cancel', {
            selector: 'button[cos-stroked-button]',
          })
        );

        spectator.click(cancelButton);

        //Assert

        expect(component.control.value).toEqual(initialVal);
      });

      it('should have new value on save', () => {
        //Arrange
        const initialVal = 'test company';
        const newVal = 'test company update';
        const { component, spectator } = testSetup({
          isEditable: true,
        });
        const companiesService = spectator.inject(CompaniesService);
        jest.spyOn(companiesService, 'exists').mockReturnValue(of(false));

        //Act
        component.control.setValue(initialVal);
        spectator.detectComponentChanges();

        const editButton = spectator.query(
          byText('Edit', {
            selector: 'button[cos-button]',
          })
        );

        spectator.click(editButton);

        component.control.setValue(newVal);

        const saveButton = spectator.query(
          byText('Save', {
            selector: 'button[cos-flat-button]',
          })
        );

        spectator.click(saveButton);

        //Assert
        expect(component.control.value).toEqual(newVal);
      });
    });
  });
});
