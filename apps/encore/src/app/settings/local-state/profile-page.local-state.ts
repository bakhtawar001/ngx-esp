import { Injectable } from '@angular/core';
import { asDispatch, fromSelector } from '@cosmos/state';
import {
  AuthFacade,
  User,
  UserProfileActions,
  UserProfileQueries,
} from '@esp/auth';
import {
  ContactsDetailQueries,
  ContactsActions,
  ContactsQueries,
} from '@esp/contacts';
import { LookupTypeQueries } from '@esp/lookup-types';
import { Contact } from '@esp/models';
import { PartyLocalState } from '@esp/parties';
import { take } from 'rxjs/operators';
import { NamePanelRowLocalState } from '../forms/name-panel-row';

@Injectable()
export class ProfilePageLocalState
  extends PartyLocalState<ProfilePageLocalState>
  implements NamePanelRowLocalState
{
  private readonly _getContact = asDispatch(ContactsActions.Get);
  private readonly _updateName = asDispatch(UserProfileActions.UpdateFullName);

  readonly updateUserNameOperation = fromSelector(
    UserProfileQueries.updateUserNameOperation
  );
  readonly updateLoginEmailOperation = fromSelector(
    UserProfileQueries.updateLoginEmailOperation
  );

  readonly contactIsLoading = fromSelector(ContactsQueries.isLoading);
  readonly contactHasLoaded = fromSelector(ContactsQueries.hasLoaded);

  readonly lookupTypesIsLoading = fromSelector(LookupTypeQueries.isLoading);
  readonly lookupTypesHasLoaded = fromSelector(LookupTypeQueries.hasLoaded);

  readonly user = fromSelector(UserProfileQueries.getUser) as User;
  readonly contact = fromSelector(ContactsDetailQueries.getContact) as Contact;
  readonly patchContact = asDispatch(ContactsActions.Patch);
  readonly updateUserName = asDispatch(UserProfileActions.UpdateUserName);
  readonly updateLoginEmail = asDispatch(UserProfileActions.UpdateLoginEmail);

  get data(): User {
    return this.user;
  }

  get party(): Contact {
    return this.contact;
  }

  get partyIsReady(): boolean {
    return (
      !this.contactIsLoading &&
      this.contactHasLoaded &&
      !this.lookupTypesIsLoading &&
      this.lookupTypesHasLoaded
    );
  }

  constructor(private readonly _auth: AuthFacade) {
    super();

    this._auth.profile$.pipe(take(1)).subscribe((user) => {
      if (user?.ContactId !== this.contact?.Id) {
        this._getContact(user.ContactId);
      }
    });
  }

  save(party: Partial<Contact>): void {
    this.patchContact(party);
  }

  updateName(data: Partial<Contact> | Partial<User>): void {
    this._updateName({
      GivenName: data.GivenName,
      FamilyName: data.FamilyName,
    });
  }
}
