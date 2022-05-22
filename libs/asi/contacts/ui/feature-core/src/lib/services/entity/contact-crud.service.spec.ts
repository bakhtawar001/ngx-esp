import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { CollaboratorsDialogService } from '@asi/collaborators/ui/feature-core';
import { ContactDialogService } from '@asi/contacts/ui/feature-core';
import {
  ConfirmDialogService,
  ENTITY_CRUD_ACTIONS,
} from '@asi/ui/feature-core';
import { ContactsSearchActions, ContactsService } from '@esp/contacts';
import { createServiceFactory, mockProvider } from '@ngneat/spectator/jest';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { ContactCrudService } from './contact-crud.service';
import { TOAST_MESSAGES } from './toast-messages';

describe('ContactCrudService', () => {
  const createService = createServiceFactory({
    service: ContactCrudService,
    imports: [HttpClientTestingModule],
    providers: [
      mockProvider(ContactsService),
      mockProvider(ConfirmDialogService),
      mockProvider(CollaboratorsDialogService),
      mockProvider(ContactDialogService),
      mockProvider(Store),
    ],
  });

  const testSetup = (options?: {
    createAction?: Type<unknown>;
    deleteAction?: Type<unknown>;
    transferOwnershipAction?: Type<unknown>;
  }) => {
    const spectator = createService({
      providers: [
        {
          provide: ENTITY_CRUD_ACTIONS,
          useValue: {
            create: options?.createAction ?? undefined,
            delete: options?.deleteAction ?? undefined,
            transferOwnership: options?.transferOwnershipAction ?? undefined,
          },
        },
      ],
    });
    const service = spectator.service;

    const changeOwnershipService = spectator.inject(CollaboratorsDialogService);
    const confirmService = spectator.inject(ConfirmDialogService);
    const contactService = spectator.inject(ContactDialogService);
    const restClient = spectator.inject(ContactsService);
    const store = spectator.inject(Store);

    return {
      changeOwnershipService,
      confirmService,
      contactService,
      restClient,
      spectator,
      service,
      store,
    };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    const { service } = testSetup();
    expect(service).toBeTruthy();
  });

  describe('create', () => {
    it('should not dispatch ContactsSearchActions.Create action when no result is returned from dialog', async () => {
      class CreateAction {}

      const { service, contactService, store } = testSetup({
        createAction: CreateAction,
      });

      const createContactSpy = jest
        .spyOn(contactService, 'openCreateContactDialog')
        .mockReturnValue(of(undefined));

      const stateSpe = jest.spyOn(store, 'dispatch');

      await service.create();

      expect(createContactSpy).toHaveBeenCalled();
      expect(stateSpe).not.toHaveBeenCalled();
    });

    it('should open createContactDialog and dispatch ContactsSearchActions.Create action', async () => {
      class CreateAction {}

      const result = { GivenName: 'test' } as any;
      const { service, contactService, store } = testSetup({
        createAction: CreateAction,
      });

      const createContactSpy = jest
        .spyOn(contactService, 'openCreateContactDialog')
        .mockReturnValue(of(result));
      const stateSpe = jest.spyOn(store, 'dispatch');

      await service.create();

      expect(createContactSpy).toHaveBeenCalled();
      expect(stateSpe).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should do nothing if can not be deleted', async () => {
      const { service, restClient, confirmService, store } = testSetup();
      jest
        .spyOn(restClient, 'validateDelete')
        .mockReturnValue(of({ IsDeletable: false } as any));

      await service.delete({} as any);

      expect(store.dispatch).toHaveBeenCalledWith({
        config: undefined,
        payload: TOAST_MESSAGES.CONTACT_CANNOT_BE_DELETED(),
      });
      expect(confirmService.confirm).not.toHaveBeenCalled();
    });

    it('should do nothing if can be deleted but did not confirm delete', async () => {
      const { service, restClient, confirmService, store } = testSetup();
      jest
        .spyOn(restClient, 'validateDelete')
        .mockReturnValue(of({ IsDeletable: true }));
      jest.spyOn(confirmService, 'confirm').mockReturnValue(of(null as any));

      await service.delete({} as any);

      expect(confirmService.confirm).toHaveBeenCalled();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should do nothing if can be deleted, confirmed but no delete action provided', async () => {
      const { service, restClient, confirmService, store } = testSetup();
      jest
        .spyOn(restClient, 'validateDelete')
        .mockReturnValue(of({ IsDeletable: true }));
      jest.spyOn(confirmService, 'confirm').mockReturnValue(of(true));

      await service.delete({} as any);

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch provided delete action', async () => {
      class TestDeleteAction {}

      const { service, restClient, confirmService, store } = testSetup({
        deleteAction: TestDeleteAction,
      });
      jest
        .spyOn(restClient, 'validateDelete')
        .mockReturnValue(of({ IsDeletable: true }));
      jest.spyOn(confirmService, 'confirm').mockReturnValue(of(true));

      await service.delete({} as any);

      expect(store.dispatch).toHaveBeenCalled();
    });
  });

  describe('transfer ownership', () => {
    it('should do nothing if there is no new owner selected', async () => {
      const { service, changeOwnershipService, store } = testSetup();
      jest
        .spyOn(changeOwnershipService, 'openTransferOwnershipDialog')
        .mockReturnValue(of({} as any));

      await service.transferOwnership({} as any);

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should do nothing if new owner selected, but no transfer ownership action provided', async () => {
      const { service, changeOwnershipService, store } = testSetup();
      jest
        .spyOn(changeOwnershipService, 'openTransferOwnershipDialog')
        .mockReturnValue(of({ Id: 1 } as any));

      await service.transferOwnership({} as any);

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch provided transfer ownership action', async () => {
      class TestTransferOwnershipAction {}

      const { service, changeOwnershipService, store } = testSetup({
        transferOwnershipAction: TestTransferOwnershipAction,
      });
      jest
        .spyOn(changeOwnershipService, 'openTransferOwnershipDialog')
        .mockReturnValue(of({ Id: 1 } as any));

      await service.transferOwnership({} as any);

      expect(store.dispatch).toHaveBeenCalled();
    });
  });
});
