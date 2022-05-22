import { Inject, Injectable, Provider } from '@angular/core';
import { CollaboratorsDialogService } from '@asi/collaborators/ui/feature-core';
import {
  ConfirmDialogService,
  CreateEntity,
  DeleteEntity,
  ENTITY_CRUD_ACTIONS,
  EntityCrudActions,
  TransferEntityOwnership,
} from '@asi/ui/feature-core';
import { ToastActions } from '@cosmos/components/notification';
import { ContactsSearchActions, ContactsService } from '@esp/contacts';
import { Contact, ContactSearch } from '@esp/models';
import { Store } from '@ngxs/store';
import { EMPTY, firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ContactDialogService } from '../contact';
import { TOAST_MESSAGES } from './toast-messages';
import { CreateContactData } from '../../dialogs';

type ContactEntity = Contact | ContactSearch;

@Injectable()
export class ContactCrudService
  implements
    CreateEntity<Partial<CreateContactData>>,
    DeleteEntity<ContactEntity>,
    TransferEntityOwnership<ContactEntity>
{
  static withProviders(entityCrudActions: EntityCrudActions): Provider[] {
    return [
      ContactCrudService,
      ContactDialogService,
      {
        provide: CreateEntity,
        useExisting: ContactCrudService,
      },
      {
        provide: DeleteEntity,
        useExisting: ContactCrudService,
      },
      {
        provide: TransferEntityOwnership,
        useExisting: ContactCrudService,
      },
      {
        provide: ENTITY_CRUD_ACTIONS,
        useValue: entityCrudActions,
      },
    ];
  }

  constructor(
    private readonly confirmDialogService: ConfirmDialogService,
    private readonly contactDialogService: ContactDialogService,
    private readonly changeOwnershipDialogService: CollaboratorsDialogService,
    @Inject(ENTITY_CRUD_ACTIONS)
    private readonly entityCrudActions: EntityCrudActions,
    private readonly restClient: ContactsService,
    private readonly store: Store
  ) {}

  async create(data?: Partial<CreateContactData>): Promise<void> {
    const createAction = this.entityCrudActions?.create;

    if (!createAction) {
      console.error(`No create action specified for entity ${data}`);
      return;
    }

    return firstValueFrom(
      this.contactDialogService.openCreateContactDialog(data)
    ).then((result) => {
      if (result) {
        this.store.dispatch(new createAction(result));
      }
    });
  }

  async delete(entity: ContactEntity): Promise<void> {
    const canBeDeleted = await this.checkIfCanDelete(entity);

    if (!canBeDeleted) {
      this.store.dispatch(
        new ToastActions.Show(TOAST_MESSAGES.CONTACT_CANNOT_BE_DELETED())
      );
      return;
    }

    const isConfirmed = await this.confirmDelete();

    if (!isConfirmed) {
      return;
    }

    const deleteAction = this.entityCrudActions?.delete;

    if (!deleteAction) {
      console.error(`No delete action specified for entity ${entity}`);
      return;
    }

    this.store.dispatch(new deleteAction(entity));
  }

  async transferOwnership(entity: ContactEntity): Promise<void> {
    const newOwner = await firstValueFrom(
      this.changeOwnershipDialogService.openTransferOwnershipDialog({ entity })
    );

    if (!newOwner) {
      return;
    }

    const transferOwnershipAction = this.entityCrudActions?.transferOwnership;

    if (!transferOwnershipAction) {
      console.error(
        `No transfer ownership action specified for entity ${entity}`
      );
      return;
    }

    this.store.dispatch(new transferOwnershipAction(entity, newOwner));
  }

  private async checkIfCanDelete(contact: ContactEntity): Promise<boolean> {
    return firstValueFrom(
      this.restClient.validateDelete(contact.Id).pipe(
        map((res) => !!res && res.IsDeletable),
        catchError(() => {
          this.store.dispatch(
            new ToastActions.Show(TOAST_MESSAGES.CONTACT_CANNOT_BE_DELETED())
          );
          return EMPTY;
        })
      )
    );
  }

  private async confirmDelete(): Promise<boolean> {
    return firstValueFrom(
      this.confirmDialogService
        .confirm({
          message: `Are you sure you want to delete this contact?`,
          confirm: `Yes, remove this contact`,
          cancel: 'No, do not delete',
        })
        .pipe(map((res) => !!res))
    );
  }
}
