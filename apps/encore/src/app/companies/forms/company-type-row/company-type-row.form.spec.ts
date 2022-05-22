import { AuthFacade } from '@esp/auth';
import { CompaniesMockDb } from '@esp/__mocks__/companies';
import {
  byText,
  createComponentFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { CompanyDetailLocalState } from '../../local-states';
import {
  CompanyTypeRowForm,
  CompanyTypeRowFormModule,
} from './company-type-row.form';

const company = CompaniesMockDb.Companies[0];

describe('CompanyTypeRowForm', () => {
  const createComponent = createComponentFactory({
    component: CompanyTypeRowForm,
    imports: [CompanyTypeRowFormModule],
    providers: [
      mockProvider(AuthFacade, {
        user: {
          hasRole: (role) => true,
        },
      }),
      mockProvider(Store, {
        select: (selector: any) => of('empty'),
      }),
    ],
  });

  const testSetup = (options?: { isEditable?: boolean }) => {
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
          party: { ...company, IsEditable: options?.isEditable || false },
        }),
      ],
    });
    const component = spectator.component;
    return { spectator, component };
  };

  it('should create', () => {
    // Arrange
    const { spectator, component } = testSetup();

    // Assert
    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should display the row icon', () => {
    // Arrange
    const { spectator } = testSetup();
    const icon = spectator.query('.form-row-icon');

    // Assert
    expect(icon).toExist();
    expect(icon).toHaveClass('fas fa-building');
  });

  it('should display row title', () => {
    //Arrange
    const { spectator } = testSetup();
    const titleEl = spectator.query('.settings-main-content');

    //Assert
    expect(titleEl).toContainText('Company Type');
  });

  it('should display selected company type(s)', () => {
    //Arrange
    const { component, spectator } = testSetup();
    const selectedTypes = ['Customer', 'Decorator'];

    // Act
    component.state.party.IsCustomer = true;
    component.state.party.IsDecorator = true;
    component.state.party.IsSupplier = false;
    spectator.detectComponentChanges();
    const selectedTypesText = spectator.query('.form-row-value');

    // Assert
    expect(selectedTypesText).toExist();
    expect(selectedTypesText).toHaveText(
      `${selectedTypes[0]}, ${selectedTypes[1]}`
    );
  });

  describe('Edit', () => {
    it("should use 'checkbox - primary' control", () => {
      // Arrange
      const { spectator } = testSetup({ isEditable: true });
      const editButton = spectator.query(
        byText('Add', {
          selector: '.company-type-row button[cos-button]',
        })
      );

      // Act
      spectator.click(editButton);
      spectator.detectComponentChanges();
      const checkboxes = spectator.queryAll('.cos-form-row > cos-checkbox');

      // Assert
      expect(checkboxes[0]).toHaveClass('cos-checkbox');
    });

    it("should show 3 sets of checkboxes stacked with each labeled separately as 'Customer, Supplier, Decorator'", () => {
      // Arrange
      const { spectator } = testSetup({ isEditable: true });
      const editButton = spectator.query(
        byText('Add', {
          selector: '.company-type-row button[cos-button]',
        })
      );

      // Act
      spectator.click(editButton);
      spectator.detectComponentChanges();
      const checkboxes = spectator.queryAll('.cos-form-row > cos-checkbox');
      const checkboxLabels = spectator.queryAll(
        '.cos-form-row > cos-checkbox > label > span'
      );

      // Assert
      expect(checkboxes.length).toEqual(3);
      expect(checkboxes[0]).toHaveClass('cos-checkbox');
      expect(checkboxLabels[0]).toHaveText('Customer');
      expect(checkboxes[1]).toHaveClass('cos-checkbox');
      expect(checkboxLabels[1]).toHaveText('Supplier');
      expect(checkboxes[2]).toHaveClass('cos-checkbox');
      expect(checkboxLabels[2]).toHaveText('Decorator');
    });

    it('should set required to True on row label and one type must be selected', () => {
      // Arrange
      const { spectator } = testSetup({ isEditable: true });
      const editButton = spectator.query(
        byText('Add', {
          selector: '.company-type-row button[cos-button]',
        })
      );

      // Act
      spectator.click(editButton);
      spectator.detectComponentChanges();
      const checkboxInputs = spectator.queryAll(
        '.cos-form-row > cos-checkbox > label > div.cos-checkbox-inner-container > input'
      );
      let saveButton = spectator.query(
        byText('Save', {
          selector: 'button[type="submit"]',
        })
      );

      // Assert
      expect(checkboxInputs[0].getAttribute('aria-checked')).toEqual('false');
      expect(checkboxInputs[1].getAttribute('aria-checked')).toEqual('false');
      expect(checkboxInputs[2].getAttribute('aria-checked')).toEqual('false');
      expect(saveButton).toHaveClass('cos-button-disabled');

      // Act again
      spectator.click(checkboxInputs[0]);
      spectator.detectComponentChanges();
      saveButton = spectator.query(
        byText('Save', {
          selector: 'button[type="submit"]',
        })
      );

      // Re-Assert
      expect(checkboxInputs[0].getAttribute('aria-checked')).toEqual('true');
      expect(checkboxInputs[1].getAttribute('aria-checked')).toEqual('false');
      expect(checkboxInputs[2].getAttribute('aria-checked')).toEqual('false');
      expect(saveButton).not.toHaveClass('cos-button-disabled');
    });
  });
});
