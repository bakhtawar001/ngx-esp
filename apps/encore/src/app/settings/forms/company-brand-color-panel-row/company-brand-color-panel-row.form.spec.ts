import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthFacade } from '@esp/auth';
import { EspSettingsModule, SettingsService } from '@esp/settings';
import {
  byText,
  createComponentFactory,
  mockProvider,
  Spectator
} from '@ngneat/spectator/jest';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import {
  SettingsCompanyBrandColorPanelRowForm,
  SettingsCompanyBrandColorPanelRowFormModule
} from './company-brand-color-panel-row.form';

describe('SettingsCompanyBrandColorPanelRowForm', () => {
  let component: SettingsCompanyBrandColorPanelRowForm;
  let spectator: Spectator<SettingsCompanyBrandColorPanelRowForm>;
  let store: Store;

  const createComponent = createComponentFactory({
    component: SettingsCompanyBrandColorPanelRowForm,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      EspSettingsModule,
      SettingsCompanyBrandColorPanelRowFormModule,
    ],
    providers: [
      mockProvider(AuthFacade, {
        user: {
          hasRole: jest.fn(() => true),
        },
      }),
      mockProvider(SettingsService, {
        updateSetting: jest.fn((code, value) => of(value)),
      }),
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    store = spectator.inject(Store);

    store.reset({
      settings: {
        settings: {
          'company_profile.primary_brand_color': {
            Value: '#333333',
          },
        },
      },
    });

    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display color value', () => {
    const colorValue = component.state.value;
    const websiteRow = spectator.query('.settings-company-color-name');

    expect(websiteRow.textContent).toMatch(colorValue);
  });

  it('should show previous value on cancel', () => {
    const initialVal = '#333333';
    const newVal = '#666666';

    component.control.setValue(initialVal);
    spectator.detectComponentChanges();

    const editButton = spectator.query(
      byText('Edit', {
        selector: '.company-settings-brand-color button[cos-button]',
      })
    );

    spectator.click(editButton);

    component.control.setValue(newVal);

    const cancelButton = spectator.query(
      byText('Cancel', {
        selector: '.company-settings-brand-color button[cos-stroked-button]',
      })
    );

    spectator.click(cancelButton);

    expect(component.control.value).toEqual(initialVal);
  });

  it('should have new value on save', () => {
    const initialVal = '#333333';
    const newVal = '#666666';

    component.control.setValue(initialVal);
    spectator.detectComponentChanges();

    const editButton = spectator.query(
      byText('Edit', {
        selector: '.company-settings-brand-color button[cos-button]',
      })
    );

    spectator.click(editButton);

    component.control.setValue(newVal);

    const saveButton = spectator.query(
      byText('Save', {
        selector: '.company-settings-brand-color button[cos-flat-button]',
      })
    );

    spectator.click(saveButton);

    expect(component.control.value).toEqual(newVal);
  });
});
