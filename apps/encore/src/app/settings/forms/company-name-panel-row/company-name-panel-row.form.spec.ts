import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormControl } from '@cosmos/forms';
import { AuthFacade } from '@esp/auth';
import {
  byText,
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  CompanyNamePanelRowForm,
  CompanyNamePanelRowFormModule,
} from './company-name-panel-row.form';

describe('CompanyNamePanelRowForm', () => {
  let spectator: Spectator<CompanyNamePanelRowForm>;
  let component: CompanyNamePanelRowForm;
  let nameControl: FormControl<string>;

  const createComponent = createComponentFactory({
    component: CompanyNamePanelRowForm,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      CompanyNamePanelRowFormModule,
    ],
    providers: [
      mockProvider(AuthFacade, {
        user: {
          hasRole: jest.fn(() => true),
        },
      }),
    ],
    detectChanges: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Company Name', () => {
    beforeEach(() => {
      nameControl = component.control;
      nameControl.reset();
    });

    it('should have default company name', () => {
      nameControl.setValue('Asi Central');
      spectator.detectComponentChanges();

      const row = spectator.query('.company-settings-name');
      const companyName = row.querySelector('.form-row-value');
      expect(companyName.textContent).toMatch('Asi Central');
    });

    it('should have default company name in input', () => {
      nameControl.setValue('Asi Central');
      spectator.detectComponentChanges();

      const row = spectator.query('.company-settings-name');
      const editButton = spectator.query(
        byText('Edit', {
          selector: '.company-settings-name button[cos-button]',
        })
      );

      spectator.click(editButton);
      const input = row.querySelector('[cos-input]') as HTMLInputElement;
      expect(input.value).toMatch('Asi Central');
    });

    it('should be panel', () => {
      const row = spectator.query('.company-settings-name');
      const editButton = spectator.query(
        byText('Add', {
          selector: '.company-settings-name button[cos-button]',
        })
      );

      spectator.click(editButton);
      const input = row.querySelector('[cos-input]') as HTMLInputElement;
      expect(input).toBeVisible();
    });

    it('should be required', () => {
      // maybe test the submit here?
      expect(nameControl.errors?.required).toBeTruthy();
    });

    // is this really testing the control or angulars validators?
    it('should not be able to input more than 50 characters', () => {
      nameControl.setValue(
        'asi central company name testing more than 50 characters'
      );

      expect(nameControl.errors?.maxlength).toBeTruthy();
    });

    it("should display error 'You must enter a value' when field is blank", () => {
      nameControl.setValue(null);

      expect(nameControl.valid).toBeFalsy();
      expect(nameControl.errors.required).toBeTruthy();
    });

    it('save button should be disabled when field is blank', () => {
      nameControl.setValue(null);
      const row = spectator.query('.company-settings-name');
      const editButton = spectator.query(
        byText('Add', {
          selector: '.company-settings-name button[cos-button]',
        })
      );
      spectator.click(editButton);
      const saveButton = row.querySelector('button[type="submit"]');
      expect(saveButton).toBeDisabled();
    });
  });
});
