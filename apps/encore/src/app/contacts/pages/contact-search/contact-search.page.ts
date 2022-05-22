import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ContactCrudService } from '@asi/contacts/ui/feature-core';
import { AsiEmptyStateInfoModule } from '@asi/ui/feature-core';
import { CosButtonModule } from '@cosmos/components/button';
import { trackItem } from '@cosmos/core';
import { NavigationItem } from '@cosmos/layout';
import { ContactsSearchActions } from '@esp/contacts';
import { ContactSearch } from '@esp/models';
import {
  EspSearchBoxModule,
  EspSearchPaginationModule,
  EspSearchSortModule,
  EspSearchTabsModule,
  SEARCH_LOCAL_STATE,
} from '@esp/search';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DIRECTORY_MENU } from '../../../directory/configs';
import { ContactCardComponentModule } from '../../components/contact-card';
import { CONTACTS_SORT_OPTIONS, CONTACTS_TABS } from '../../configs';
import { ContactSearchLocalState } from '../../local-states';

@UntilDestroy()
@Component({
  selector: 'esp-contact-search-page',
  templateUrl: './contact-search.page.html',
  styleUrls: ['./contact-search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ContactCrudService.withProviders({
      create: ContactsSearchActions.Create,
      delete: ContactsSearchActions.Delete,
      transferOwnership: ContactsSearchActions.TransferOwnership,
    }),
    ContactSearchLocalState,
    { provide: SEARCH_LOCAL_STATE, useExisting: ContactSearchLocalState },
  ],
})
export class ContactSearchPage {
  readonly sortMenuOptions = CONTACTS_SORT_OPTIONS;
  readonly tabs = CONTACTS_TABS;
  readonly trackContact = trackItem<ContactSearch>(['Id']);

  constructor(
    public readonly state: ContactSearchLocalState,
    @Inject(DIRECTORY_MENU) readonly menu: NavigationItem[],
    private readonly _router: Router
  ) {
    this.state.connect(this);
  }

  async createContact(): Promise<void> {
    await this.state.createContact();
  }

  navigateToContact(contact: ContactSearch): void {
    this._router.navigate([`contacts`, contact.Id], {
      state: {
        backToContactsDirectoryUrl: this._router.url,
      },
    });
  }

  async delete(party: ContactSearch): Promise<void> {
    await this.state.deleteContact(party);
  }

  toggleStatus(party: ContactSearch): void {
    party.IsActive
      ? this.state.deactivateContact(party)
      : this.state.activateContact(party);
  }

  async transferOwnership(party: ContactSearch): Promise<void> {
    await this.state.transferOwnership(party);
  }
}

@NgModule({
  declarations: [ContactSearchPage],
  imports: [
    CommonModule,
    RouterModule,

    CosButtonModule,

    ContactCardComponentModule,

    EspSearchBoxModule,
    EspSearchPaginationModule,
    EspSearchSortModule,
    EspSearchTabsModule,
    AsiEmptyStateInfoModule,
  ],
})
export class ContactSearchPageModule {}
