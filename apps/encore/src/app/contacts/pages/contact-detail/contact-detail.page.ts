import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AsiManageCollaboratorsModule } from '@asi/collaborators/ui/feature-core';
import { AsiContactActionsMenuModule } from '@asi/contacts/ui/feature-components';
import { CosAvatarListModule } from '@cosmos/components/avatar-list';
import { CosButtonModule } from '@cosmos/components/button';
import { CosVerticalMenuModule } from '@cosmos/components/vertical-menu';
import { NavigationItem } from '@cosmos/layout';
import { HasWriteAccessPipe, HasWriteAccessPipeModule } from '@esp/auth';
import { Contact } from '@esp/models';
import { PARTY_LOCAL_STATE } from '@esp/parties';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map } from 'rxjs/operators';
import { DetailHeaderComponentModule } from '../../../core/components/detail-header';
import { PartyAvatarComponentModule } from '../../../directory/components/party-avatar';
import { CONTACT_MENU, ContactMenu } from '../../configs';
import { ContactDetailLocalState } from '../../local-states';

@UntilDestroy()
@Component({
  selector: 'esp-contact-detail-page',
  templateUrl: './contact-detail.page.html',
  styleUrls: ['./contact-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    ContactDetailLocalState,
    {
      provide: PARTY_LOCAL_STATE,
      useExisting: ContactDetailLocalState,
    },
    {
      provide: CONTACT_MENU,
      useValue: ContactMenu,
    },
  ],
})
export class ContactDetailPage implements OnInit {
  canManageCollaborators = false;
  contactId!: number;

  private readonly backToContactsDirectoryUrl =
    // See `contact-search.page.ts -> ContactSearchPage#navigateToContact`.
    this.router.getCurrentNavigation()?.extras.state
      ?.backToContactsDirectoryUrl || '/directory/contacts';

  private readonly state$ = this.state.connect(this);

  constructor(
    private readonly hasWriteAccessPipe: HasWriteAccessPipe,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly state: ContactDetailLocalState,
    @Inject(CONTACT_MENU) public readonly menu: NavigationItem[]
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(untilDestroyed(this)).subscribe((params) => {
      this.contactId = params.id;
      this.state.getPartyById(this.contactId);
    });

    this.initCanManageCollaborators();
  }

  goBack(): void {
    this.router.navigateByUrl(this.backToContactsDirectoryUrl);
  }

  private initCanManageCollaborators(): void {
    this.state$
      .pipe(
        filter(({ partyIsReady }) => partyIsReady),
        map(({ party }) => party),
        filter(Boolean),
        untilDestroyed(this)
      )
      .subscribe((contact: Contact) => {
        this.canManageCollaborators = this.hasWriteAccessPipe.transform(
          [],
          contact.OwnerId
        );
      });
  }
}

@NgModule({
  declarations: [ContactDetailPage],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    RouterModule,

    MatMenuModule,
    MatTabsModule,

    CosAvatarListModule,
    CosButtonModule,
    CosVerticalMenuModule,

    PartyAvatarComponentModule,

    DetailHeaderComponentModule,
    AsiContactActionsMenuModule,
    AsiManageCollaboratorsModule,

    HasWriteAccessPipeModule.withProvide(),
  ],
})
export class ContactDetailPageModule {}
