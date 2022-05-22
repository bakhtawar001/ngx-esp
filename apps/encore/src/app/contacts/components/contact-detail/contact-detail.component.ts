import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
} from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';
import { PhoneTypeEnum } from '@esp/models';
import { PARTY_LOCAL_STATE } from '@esp/parties';
import { UntilDestroy } from '@ngneat/until-destroy';
import { PhoneListPanelRowFormModule } from '../../../settings/components/phone-list-panel-row';
import { AddressListPanelFormModule } from '../../../settings/forms/address-list-panel';
import { ContactLinksPanelFormModule } from '../../../settings/forms/contact-links-panel';
import { EmailListPanelRowFormModule } from '../../../settings/forms/email-list-panel-row';
import {
  NAME_PANEL_LOCAL_STATE,
  NamePanelRowFormModule,
} from '../../../settings/forms/name-panel-row';
import { ProfileAvatarPanelRowFormModule } from '../../../settings/forms/profile-avatar-panel-row';
import { ContactDetailLocalState } from '../../local-states';

@UntilDestroy()
@Component({
  selector: 'esp-contact-detail',
  templateUrl: './contact-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ContactDetailLocalState,
    { provide: PARTY_LOCAL_STATE, useExisting: ContactDetailLocalState },
    { provide: NAME_PANEL_LOCAL_STATE, useExisting: ContactDetailLocalState },
  ],
})
export class ContactDetailComponent {
  readonly defaultPhoneType = PhoneTypeEnum.Mobile;

  get isEditable(): boolean {
    return this.state.party?.IsEditable;
  }

  get isUser(): boolean {
    return this.state.party?.IsUser;
  }

  constructor(
    @Inject(PARTY_LOCAL_STATE) private readonly state: ContactDetailLocalState
  ) {
    this.state.connect(this);
  }
}

@NgModule({
  declarations: [ContactDetailComponent],
  imports: [
    CosButtonModule,
    CosSegmentedPanelModule,
    PhoneListPanelRowFormModule,
    NamePanelRowFormModule,
    EmailListPanelRowFormModule,
    ProfileAvatarPanelRowFormModule,
    AddressListPanelFormModule,
    ContactLinksPanelFormModule,
  ],
  exports: [ContactDetailComponent],
})
export class ContactDetailComponentModule {}
