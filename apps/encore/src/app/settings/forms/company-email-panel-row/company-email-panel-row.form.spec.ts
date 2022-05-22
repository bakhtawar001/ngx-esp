import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthFacade } from '@esp/auth';
import { EspSettingsModule } from '@esp/settings';
import {
  byText,
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  CompanyEmailPanelRowForm,
  CompanyEmailPanelRowFormModule,
} from './company-email-panel-row.form';

describe('CompanyEmailPanelRowForm', () => {
  let component: CompanyEmailPanelRowForm;
  let spectator: Spectator<CompanyEmailPanelRowForm>;

  const createComponent = createComponentFactory({
    component: CompanyEmailPanelRowForm,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      EspSettingsModule,
      CompanyEmailPanelRowFormModule,
    ],
    providers: [
      mockProvider(AuthFacade, {
        user: {
          hasRole: jest.fn(() => true),
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should error on invalid email address', () => {
    component.control.setValue('email@emaildotcom');

    expect(component.control.errors?.email).toBeTruthy();
  });

  it('should not have errors on valid email address', () => {
    component.control.setValue('email@email.com');

    expect(component.control.errors?.email).not.toBeTruthy();
  });

  it('should show error message when no value is entered', () => {
    component.control.setValue('');

    expect(component.control.valid).toBeFalsy();
    expect(component.control.errors.required).toBeTruthy();
  });

  it('should show error message when email is invalid', () => {
    component.control.setValue('email');

    expect(component.control.valid).toBeFalsy();
    expect(component.control.errors.email).toBeTruthy();
  });

  it('should be editable', () => {
    const row = spectator.query('.company-settings-email');
    const editButton = spectator.query(
      byText('Add', {
        selector: '.company-settings-email button[cos-button]',
      })
    );
    spectator.click(editButton);
    const input = row.querySelector('[cos-input]') as HTMLInputElement;
    expect(input).toBeVisible();
  });

  it('should not be able to input more than 100 characters', () => {
    component.control.setValue(
      'asi central company email testing more than 100 characters asi central company email testing more than 100 characters'
    );

    expect(component.control.valid).toBeFalsy();
    expect(component.control.errors?.maxlength).toBeTruthy();
  });

  // seems like this isn't testing the company page but is
  // teting the panel-editable-row
  describe('Save Button', () => {
    it('should be disabled when field is blank', () => {
      component.control.setValue(null);
      const row = spectator.query('.company-settings-email');
      const editButton = spectator.query(
        byText('Add', {
          selector: '.company-settings-email button[cos-button]',
        })
      );

      spectator.click(editButton);

      const saveButton = row.querySelector('button[type="submit"]');
      expect(saveButton).toBeDisabled();
    });
  });
});
