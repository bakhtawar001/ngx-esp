import { Injectable } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  CreateEntity,
  DeleteEntity,
  TransferEntityOwnership,
} from '@asi/ui/feature-core';
import {
  asDispatch,
  fromSelector,
  stringQueryParamConverter,
  urlQueryParameter,
} from '@cosmos/state';
import { AuthFacade } from '@esp/auth';
import { ContactsSearchActions, ContactsSearchQueries } from '@esp/contacts';
import { ContactSearch, SearchFilter } from '@esp/models';
import { SearchPageLocalState } from '@esp/search';
import { syncDirectorySetting } from '../../directory/utils';
import { CONTACTS_SORT_OPTIONS, CONTACTS_TABS } from '../configs';

@Injectable()
export class ContactSearchLocalState extends SearchPageLocalState<ContactSearchLocalState> {
  readonly activateContact = asDispatch(ContactsSearchActions.Activate);
  readonly create = asDispatch(ContactsSearchActions.Create);
  readonly criteria = fromSelector(ContactsSearchQueries.getCriteria);
  readonly contactsLoading = fromSelector(ContactsSearchQueries.isLoading);
  readonly contacts = fromSelector(ContactsSearchQueries.getHits);
  readonly deactivateContact = asDispatch(ContactsSearchActions.Deactivate);
  readonly search = asDispatch(ContactsSearchActions.Search);

  total = fromSelector(ContactsSearchQueries.getTotal);

  override sort = syncDirectorySetting(
    'directorySort',
    CONTACTS_SORT_OPTIONS[0]
  );

  override tabIndex = syncDirectorySetting('searchTabIndex', 0);

  status = urlQueryParameter<string>('status', {
    defaultValue: '',
    debounceTime: 0,
    converter: stringQueryParamConverter,
  });

  constructor(
    private readonly _authFacade: AuthFacade,
    private readonly _createContactService: CreateEntity<void>,
    private readonly _deleteContactService: DeleteEntity<ContactSearch>,
    private readonly _transferOwnershipService: TransferEntityOwnership<ContactSearch>
  ) {
    super();
  }

  async createContact(): Promise<void> {
    await this._createContactService.create();
  }

  async deleteContact(entity: ContactSearch): Promise<void> {
    await this._deleteContactService.delete(entity);
  }

  async transferOwnership(entity: ContactSearch): Promise<void> {
    await this._transferOwnershipService.transferOwnership(entity);
  }

  override get tab() {
    const tab = { ...CONTACTS_TABS[this.tabIndex] };

    const filters: Record<string, SearchFilter> = {
      IncludeOwnerDetails: { terms: ['true'] },
      ...tab.criteria.filters,
    };

    if (filters?.Owners && !filters?.Owners.terms?.length) {
      filters.Owners.terms = [`${this._authFacade.user?.Id}`];
    }

    tab.criteria.filters = filters;

    return tab;
  }

  override setTab(event: MatTabChangeEvent): void {
    this.tabIndex = event.index;
    this.from = 1;
  }
}
