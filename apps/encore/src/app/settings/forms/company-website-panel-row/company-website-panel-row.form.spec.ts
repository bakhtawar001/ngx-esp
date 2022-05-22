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
  CompanyWebsitePanelRowForm,
  CompanyWebsitePanelRowFormModule,
} from './company-website-panel-row.form';

describe('CompanyWebsitePanelRowForm', () => {
  let component: CompanyWebsitePanelRowForm;
  let spectator: Spectator<CompanyWebsitePanelRowForm>;

  const createComponent = createComponentFactory({
    component: CompanyWebsitePanelRowForm,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      CompanyWebsitePanelRowFormModule,
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

  it('should have website value', () => {
    const website = 'www.www.com';
    component.control.setValue(website);

    spectator.detectComponentChanges();

    const row = spectator.query('.company-settings-website');
    const websiteRow = row.querySelector('.form-row-value');
    expect(websiteRow.textContent).toMatch(website);
  });

  it('should not be able to input more than 100 characters', () => {
    component.control.setValue(
      'asi central company testing more than 100 characters asi central company testing more than 100 characters'
    );

    spectator.detectComponentChanges();

    expect(component.control.errors?.maxlength).toBeTruthy();
  });

  it('should be able to save changes after removing data', () => {
    component.control.setValue('www.website.com');

    spectator.detectComponentChanges();

    const editButton = spectator.query(
      byText('Edit', {
        selector: '.company-settings-website button[cos-button]',
      })
    );

    spectator.click(editButton);

    component.control.setValue(null);
    spectator.detectComponentChanges();

    const saveButton = spectator.query(
      byText('Save', {
        selector: '.company-settings-website button[cos-flat-button]',
      })
    );

    spectator.click(saveButton);

    expect(component.control.value).toEqual(null);
  });

  it('should not show error message when no website is provided', () => {
    const row = spectator.query('.company-settings-website');
    const editButton = spectator.query(
      byText('Add', {
        selector: '.company-settings-website button[cos-button]',
      })
    );

    spectator.click(editButton);

    expect(row.querySelector('.error-invalid')).not.toExist();
  });

  it('should show error message when website is invalid', () => {
    const badValue = 'www.c';

    component.control.setValue(badValue);

    expect(component.control.valid).toBeFalsy();
    expect(component.control.errors.validUrl).toBeTruthy();
  });

  it('should show previous value on cancel', () => {
    const initialVal = 'www.website.com';
    const newVal = 'www.website2.com';

    component.control.setValue(initialVal);
    spectator.detectComponentChanges();

    const editButton = spectator.query(
      byText('Edit', {
        selector: '.company-settings-website button[cos-button]',
      })
    );

    spectator.click(editButton);

    spectator.detectComponentChanges();

    component.control.setValue(newVal);

    const cancelButton = spectator.query(
      byText('Cancel', {
        selector: '.company-settings-website button[cos-stroked-button]',
      })
    );

    spectator.click(cancelButton);

    expect(component.control.value).toEqual(initialVal);
  });

  it('should have new value on save', () => {
    const initialVal = 'www.website1.com';
    const newVal = 'www.website2.com';

    component.control.setValue(initialVal);
    spectator.detectComponentChanges();

    const editButton = spectator.query(
      byText('Edit', {
        selector: '.company-settings-website button[cos-button]',
      })
    );

    spectator.click(editButton);

    spectator.detectComponentChanges();

    component.control.setValue(newVal);

    const saveButton = spectator.query(
      byText('Save', {
        selector: '.company-settings-website button[cos-flat-button]',
      })
    );

    spectator.click(saveButton);

    expect(component.control.value).toEqual(newVal);
  });
});
