import { Injectable } from '@angular/core';
import {
  CreateEntity,
  DeleteEntity,
  TransferEntityOwnership,
} from '@asi/ui/feature-core';
import { asDispatch, LocalState } from '@cosmos/state';
import { ContactsActions } from '@esp/contacts';
import { Contact } from '@esp/models';

@Injectable()
export class ContactActionsMenuLocalState extends LocalState<ContactActionsMenuLocalState> {
  readonly makeActive = asDispatch(ContactsActions.Activate);
  readonly makeInactive = asDispatch(ContactsActions.Deactivate);

  constructor(
    private readonly createContactService: CreateEntity<void>,
    private readonly deleteContactService: DeleteEntity<Contact>,
    private readonly transferOwnershipService: TransferEntityOwnership<Contact>
  ) {
    super();
  }

  async createContact(): Promise<void> {
    await this.createContactService.create();
  }

  async deleteContact(contact: Contact): Promise<void> {
    await this.deleteContactService.delete(contact);
  }

  async transferOwnership(contact: Contact): Promise<void> {
    await this.transferOwnershipService.transferOwnership(contact);
  }
}
