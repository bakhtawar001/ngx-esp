import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosImageUploadFormModule } from '@cosmos/components/image-upload-form';
import { CosInputModule } from '@cosmos/components/input';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';
import { FeatureFlagsModule } from '@cosmos/feature-flags';
import { HasRolePipeModule } from '@esp/auth';
import { CompanyAddressPanelRowFormModule } from '../../forms/company-address-panel-row';
import { CompanyAsiNumberPanelRowFormModule } from '../../forms/company-asi-number-panel-row';
import { SettingsCompanyBrandColorPanelRowFormModule } from '../../forms/company-brand-color-panel-row';
import { CompanyEmailPanelRowFormModule } from '../../forms/company-email-panel-row';
import { CompanyLogoPanelRowFormModule } from '../../forms/company-logo-panel-row';
import { CompanyNamePanelRowFormModule } from '../../forms/company-name-panel-row';
import { CompanyPhonePanelRowFormModule } from '../../forms/company-phone-panel-row';
import { CompanyWebsitePanelRowFormModule } from '../../forms/company-website-panel-row';
import { SocialMediaFormModule } from '@esp/settings';
import { ProfilePageLocalState } from '../../local-state';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
  providers: [ProfilePageLocalState],
})
export class CompanyPage {
  defaultMarket = new FormControl('United States');
  defaultCurrency = new FormControl('USD');
  conversionRate = new FormControl('1.34');

  asiCustomShareUrl = 'kraftwerk.asicentral.com';

  pageDescription =
    'This is your company information for branding, ASI account information, and default contact information. Admin permission is required to edit this information.';

  get currencyLabel() {
    return this.defaultCurrency.value === 'USD'
      ? 'US Dollar (USD)'
      : 'CA Dollar (CAD)';
  }
}

@NgModule({
  declarations: [CompanyPage],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    FeatureFlagsModule,

    CosInputModule,
    CosSegmentedPanelModule,

    HasRolePipeModule,

    AsiPanelEditableRowModule,
    SocialMediaFormModule,
    CosImageUploadFormModule,

    CompanyAddressPanelRowFormModule,
    CompanyAsiNumberPanelRowFormModule,
    SettingsCompanyBrandColorPanelRowFormModule,
    CompanyEmailPanelRowFormModule,
    CompanyLogoPanelRowFormModule,
    CompanyNamePanelRowFormModule,
    CompanyPhonePanelRowFormModule,
    CompanyWebsitePanelRowFormModule,
  ],
})
export class CompanyPageModule {}
