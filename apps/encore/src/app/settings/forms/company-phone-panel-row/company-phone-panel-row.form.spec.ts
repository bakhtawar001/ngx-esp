import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthFacade } from '@esp/auth';
import {
  byText,
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  CompanyPhonePanelRowForm,
  CompanyPhonePanelRowFormModule,
} from './company-phone-panel-row.form';

describe('CompanyPhonePanelRowForm', () => {
  let component: CompanyPhonePanelRowForm;
  let spectator: Spectator<CompanyPhonePanelRowForm>;

  const createComponent = createComponentFactory({
    component: CompanyPhonePanelRowForm,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      CompanyPhonePanelRowFormModule,
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

  it('should have phone number', () => {
    const phone = '5555555';
    component.control.setValue(phone);
    spectator.detectComponentChanges();
    const row = spectator.query('.company-settings-phone');
    const phoneNumber = row.querySelector('.form-row-value');
    expect(phoneNumber.textContent).toMatch(phone);
  });

  it('should not be able to input more than 100 characters', () => {
    component.control.setValue(
      'asi central company testing more than 100 characters asi central company testing more than 100 characters'
    );
    expect(component.control.errors?.maxlength).toBeTruthy();
  });

  it('should show error message when no value is entered', () => {
    component.control.setValue(null);

    expect(component.control.valid).toBeFalsy();
    expect(component.control.errors.required).toBeTruthy();
  });

  it('should show previous value on cancel', () => {
    const initialVal = 'initial value';
    const newVal = 'new value';
    component.control.setValue(initialVal);
    spectator.detectComponentChanges();
    const editButton = spectator.query(
      byText('Edit', {
        selector: '.company-settings-phone button[cos-button]',
      })
    );
    spectator.click(editButton);
    spectator.detectComponentChanges();
    component.control.setValue(newVal);
    const cancelButton = spectator.query(
      byText('Cancel', {
        selector: '.company-settings-phone button[cos-stroked-button]',
      })
    );
    spectator.click(cancelButton);
    expect(component.control.value).toEqual(initialVal);
  });

  it('should have new value on save', () => {
    const initialVal = 'initial value';
    const newVal = 'new value';
    component.control.setValue(initialVal);
    spectator.detectComponentChanges();
    const editButton = spectator.query(
      byText('Edit', {
        selector: '.company-settings-phone button[cos-button]',
      })
    );
    spectator.click(editButton);
    spectator.detectComponentChanges();
    component.control.setValue(newVal);
    const saveButton = spectator.query(
      byText('Save', {
        selector: '.company-settings-phone button[cos-flat-button]',
      })
    );
    spectator.click(saveButton);
    expect(component.control.value).toEqual(newVal);
  });
});
