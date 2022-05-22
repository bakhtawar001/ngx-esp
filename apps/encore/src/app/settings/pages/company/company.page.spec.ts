import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CosToastService } from '@cosmos/components/notification';
import { AuthFacade } from '@esp/auth';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import { CompanyAddressPanelRowFormModule } from '../../forms/company-address-panel-row';
import { CompanyAddressPanelRowForm } from '../../forms/company-address-panel-row/company-address-panel-row.form';
import { SettingsCompanyBrandColorPanelRowFormModule } from '../../forms/company-brand-color-panel-row';
import { SettingsCompanyBrandColorPanelRowForm } from '../../forms/company-brand-color-panel-row/company-brand-color-panel-row.form';
import { CompanyEmailPanelRowFormModule } from '../../forms/company-email-panel-row';
import { CompanyEmailPanelRowForm } from '../../forms/company-email-panel-row/company-email-panel-row.form';
import { CompanyLogoPanelRowFormModule } from '../../forms/company-logo-panel-row';
import { CompanyLogoPanelRowForm } from '../../forms/company-logo-panel-row/company-logo-panel-row.form';
import { CompanyNamePanelRowFormModule } from '../../forms/company-name-panel-row';
import { CompanyNamePanelRowForm } from '../../forms/company-name-panel-row/company-name-panel-row.form';
import { CompanyPhonePanelRowFormModule } from '../../forms/company-phone-panel-row';
import { CompanyPhonePanelRowForm } from '../../forms/company-phone-panel-row/company-phone-panel-row.form';
import { CompanyWebsitePanelRowFormModule } from '../../forms/company-website-panel-row';
import { CompanyWebsitePanelRowForm } from '../../forms/company-website-panel-row/company-website-panel-row.form';
import { CompanyPage, CompanyPageModule } from './company.page';

describe('CompanyPage', () => {
  let component: CompanyPage;
  let spectator: Spectator<CompanyPage>;

  const createComponent = createComponentFactory({
    component: CompanyPage,
    imports: [HttpClientTestingModule, NgxsModule.forRoot(), CompanyPageModule],
    providers: [
      mockProvider(CosToastService),
      mockProvider(AuthFacade, {
        profile$: of(null),
        user: {
          hasRole: jest.fn(() => true),
        },
      }),
    ],
    overrideModules: [
      [
        CompanyAddressPanelRowFormModule,
        {
          set: {
            declarations: MockComponents(CompanyAddressPanelRowForm),
            exports: MockComponents(CompanyAddressPanelRowForm),
          },
        },
      ],
      [
        SettingsCompanyBrandColorPanelRowFormModule,
        {
          set: {
            declarations: MockComponents(SettingsCompanyBrandColorPanelRowForm),
            exports: MockComponents(SettingsCompanyBrandColorPanelRowForm),
          },
        },
      ],
      [
        CompanyEmailPanelRowFormModule,
        {
          set: {
            declarations: MockComponents(CompanyEmailPanelRowForm),
            exports: MockComponents(CompanyEmailPanelRowForm),
          },
        },
      ],
      [
        CompanyLogoPanelRowFormModule,
        {
          set: {
            declarations: MockComponents(CompanyLogoPanelRowForm),
            exports: MockComponents(CompanyLogoPanelRowForm),
          },
        },
      ],
      [
        CompanyNamePanelRowFormModule,
        {
          set: {
            declarations: MockComponents(CompanyNamePanelRowForm),
            exports: MockComponents(CompanyNamePanelRowForm),
          },
        },
      ],
      [
        CompanyPhonePanelRowFormModule,
        {
          set: {
            declarations: MockComponents(CompanyPhonePanelRowForm),
            exports: MockComponents(CompanyPhonePanelRowForm),
          },
        },
      ],
      [
        CompanyWebsitePanelRowFormModule,
        {
          set: {
            declarations: MockComponents(CompanyWebsitePanelRowForm),
            exports: MockComponents(CompanyWebsitePanelRowForm),
          },
        },
      ],
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
