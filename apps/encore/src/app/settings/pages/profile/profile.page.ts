import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';
import { FeatureFlagsModule } from '@cosmos/feature-flags';
import { EspContactsModule } from '@esp/contacts';
import { FindLookupTypeValuePipeModule } from '@esp/lookup-types';
import { PARTY_LOCAL_STATE } from '@esp/parties';
import { PhoneListPanelRowFormModule } from '../../components/phone-list-panel-row';
import { AddressListPanelFormModule } from '../../forms/address-list-panel';
import { CompanyAsiNumberPanelRowFormModule } from '../../forms/company-asi-number-panel-row';
import { CompanyNamePanelRowFormModule } from '../../forms/company-name-panel-row';
import { EmailListPanelRowFormModule } from '../../forms/email-list-panel-row';
import {
  NAME_PANEL_LOCAL_STATE,
  NamePanelRowFormModule,
} from '../../forms/name-panel-row';
import { PasswordPanelRowFormModule } from '../../forms/password-panel-row';
import { ProfileAvatarPanelRowFormModule } from '../../forms/profile-avatar-panel-row';
import { SignonEmailPanelRowFormModule } from '../../forms/signon-email-panel-row';
import { SocialMediaFormModule } from '@esp/settings';
import { UsernamePanelRowFormModule } from '../../forms/username-panel-row';
import { ProfilePageLocalState } from '../../local-state';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers: [
    ProfilePageLocalState,
    { provide: PARTY_LOCAL_STATE, useExisting: ProfilePageLocalState },
    { provide: NAME_PANEL_LOCAL_STATE, useExisting: ProfilePageLocalState },
  ],
})
export class ProfilePage {
  lang = {
    preference: 'English (EN US)',
    options: ['English (EN US)', 'French (FR)', 'German (DE)'],
  };

  patternError = {
    pattern: "Only alphanumeric characters and &'()_-@;:., are allowed!",
  };
}

@NgModule({
  declarations: [ProfilePage],
  imports: [
    CommonModule,

    FeatureFlagsModule,

    EspContactsModule,

    CosSegmentedPanelModule,
    AsiPanelEditableRowModule,

    SocialMediaFormModule,

    FindLookupTypeValuePipeModule,

    PasswordPanelRowFormModule,

    AddressListPanelFormModule,
    CompanyAsiNumberPanelRowFormModule,
    CompanyNamePanelRowFormModule,
    EmailListPanelRowFormModule,
    NamePanelRowFormModule,
    PhoneListPanelRowFormModule,
    ProfileAvatarPanelRowFormModule,
    SignonEmailPanelRowFormModule,
    UsernamePanelRowFormModule,
  ],
})
export class ProfilePageModule {}
