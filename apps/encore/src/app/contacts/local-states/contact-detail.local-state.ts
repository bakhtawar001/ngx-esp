import { Injectable } from '@angular/core';
import { asDispatch, fromSelector } from '@cosmos/state';
import {
  ContactsDetailQueries,
  ContactsActions,
  ContactsQueries,
} from '@esp/contacts';
import { Contact, LinkRelationship } from '@esp/models';
import { PartyLocalState } from '@esp/parties';
import { NamePanelRowLocalState } from '../../settings/forms/name-panel-row';
import { LookupTypeQueries } from '@esp/lookup-types';

@Injectable()
export class ContactDetailLocalState
  extends PartyLocalState<ContactDetailLocalState>
  implements NamePanelRowLocalState
{
  private readonly _getCompanyById = asDispatch(ContactsActions.Get);
  private readonly _patchCompany = asDispatch(ContactsActions.Patch);
  private readonly _createLink = asDispatch(ContactsActions.CreateLink);
  private readonly _patchLink = asDispatch(ContactsActions.PatchLink);
  private readonly _removeLink = asDispatch(ContactsActions.RemoveLink);

  readonly patchContact = asDispatch(ContactsActions.Patch);

  readonly contactLoading = fromSelector(ContactsQueries.isLoading);
  readonly hasLoaded = fromSelector(ContactsQueries.hasLoaded);
  readonly contact = fromSelector(ContactsDetailQueries.getContact);
  readonly relationships = fromSelector(
    LookupTypeQueries.lookups.LinkRelationshipTypes
  );

  get data(): Contact {
    return this.contact;
  }

  get isLoading(): boolean {
    return this.contactLoading;
  }

  get party(): Contact {
    return this.contact;
  }

  get partyIsReady(): boolean {
    return !this.isLoading && this.hasLoaded;
  }

  createLink(link: LinkRelationship) {
    this._createLink({ contactId: this.contact.Id, link });
  }

  patchLink(link: LinkRelationship) {
    this._patchLink({ contactId: this.contact.Id, linkId: link.Id, link });
  }

  removeLink(linkId: number) {
    this._removeLink({ contactId: this.contact.Id, linkId: linkId });
  }

  getPartyById(id: number): void {
    this._getCompanyById(id);
  }

  save(party: Partial<Contact>): void {
    this._patchCompany(party);
  }

  updateName(data: Partial<Contact>): void {
    this.save(data);
  }
}
