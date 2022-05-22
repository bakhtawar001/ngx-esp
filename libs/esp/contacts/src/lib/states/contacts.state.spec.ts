import { Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastActions } from '@cosmos/components/notification';
import { NgxsActionCollector } from '@cosmos/testing';
import { ContactsMockDb } from '@esp/contacts/mocks';
import type { Contact } from '@esp/models';
import { createServiceFactory, mockProvider } from '@ngneat/spectator/jest';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, NgxsModule, ofActionSuccessful, Store } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { ContactsActions, ContactsSearchActions } from '../actions';
import { ContactsService } from '../services';
import { ContactsSearchState, ContactsState } from '../states';
import { TOAST_MESSAGES } from './toast-messages';

const mockContact = ContactsMockDb.Contacts[0];

describe('ContactsState', () => {
  const createService = createServiceFactory({
    service: Store,
    imports: [
      NgxsModule.forRoot([ContactsState, ContactsSearchState]),
      NgxsActionCollector.collectActions(),
    ],
    providers: [mockProvider(ContactsService), mockProvider(MatDialog)],
  });

  const testSetup = () => {
    const spectator = createService();

    const actions$ = spectator.inject(Actions);
    const store = spectator.inject(Store);
    const state = spectator.inject(ContactsState);
    const contactsService = spectator.inject(ContactsService);
    const actionCollector = spectator.inject(NgxsActionCollector);
    const actionsDispatched = actionCollector.dispatched;

    function getDispatchedActionsOfType<T>(actionType: Type<T>): T[] {
      return actionsDispatched.filter((item) => item instanceof actionType);
    }

    return {
      spectator,
      store,
      contactsService,
      state,
      actions$,
      actionsDispatched,
      getShowToastActionsDispatched: () =>
        getDispatchedActionsOfType<ToastActions.Show>(ToastActions.Show),
      getNavigateActionsDispatched: () =>
        getDispatchedActionsOfType<Navigate>(Navigate),
      getSearchActionsDispatched: () =>
        getDispatchedActionsOfType<ContactsSearchActions.Search>(
          ContactsSearchActions.Search
        ),
    };
  };

  it('should create', () => {
    const { store } = testSetup();

    expect(store).toBeTruthy();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Activate', () => {
    it('should display success toast when success', async () => {
      const { getShowToastActionsDispatched, store, contactsService } =
        testSetup();
      jest.spyOn(contactsService, 'setStatus').mockReturnValue(of({}));

      await store.dispatch(new ContactsActions.Activate({ Id: 1 } as Contact));

      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: TOAST_MESSAGES.CONTACT_ACTIVATED(),
          config: undefined,
        },
      ]);
    });

    it('should display red toast when fail', async () => {
      const { getShowToastActionsDispatched, store, contactsService } =
        testSetup();
      jest
        .spyOn(contactsService, 'setStatus')
        .mockReturnValue(throwError(() => new Error('test')));

      await store.dispatch(new ContactsActions.Activate({ Id: 1 } as Contact));

      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: TOAST_MESSAGES.CONTACT_NOT_UPDATED(),
          config: undefined,
        },
      ]);
    });
  });

  describe('Deactivate', () => {
    it('should display success toast when success', async () => {
      const { getShowToastActionsDispatched, store, contactsService } =
        testSetup();
      jest.spyOn(contactsService, 'setStatus').mockReturnValue(of({}));

      await store.dispatch(
        new ContactsActions.Deactivate({ Id: 1 } as Contact)
      );

      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: TOAST_MESSAGES.CONTACT_DEACTIVATED(),
          config: undefined,
        },
      ]);
    });

    it('should display red toast when fail', async () => {
      const { getShowToastActionsDispatched, store, contactsService } =
        testSetup();
      jest
        .spyOn(contactsService, 'setStatus')
        .mockReturnValue(throwError(() => new Error('test')));

      await store.dispatch(
        new ContactsActions.Deactivate({ Id: 1 } as Contact)
      );

      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: TOAST_MESSAGES.CONTACT_NOT_UPDATED(),
          config: undefined,
        },
      ]);
    });
  });

  describe('Delete', () => {
    it('should display success toast when success', (done) => {
      const {
        actions$,
        getShowToastActionsDispatched,
        contactsService,
        store,
      } = testSetup();
      jest.spyOn(contactsService, 'delete').mockReturnValue(of({} as any));

      store.dispatch(new ContactsActions.Delete(mockContact));

      actions$
        .pipe(ofActionSuccessful(ContactsActions.Delete))
        .subscribe(() => {
          try {
            expect(contactsService.delete).toHaveBeenCalledWith(mockContact.Id);
            const toastActions = getShowToastActionsDispatched();
            expect(toastActions).toEqual([
              {
                payload: TOAST_MESSAGES.CONTACT_DELETED(mockContact.Name),
                config: undefined,
              },
            ]);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should navigate back to directory contacts', (done) => {
      const { actions$, getNavigateActionsDispatched, contactsService, store } =
        testSetup();
      jest.spyOn(contactsService, 'delete').mockReturnValue(of({} as any));

      store.dispatch(new ContactsActions.Delete(mockContact));

      actions$
        .pipe(ofActionSuccessful(ContactsActions.Delete))
        .subscribe(() => {
          try {
            const navigateActions = getNavigateActionsDispatched();
            expect(navigateActions).toEqual([
              {
                path: ['/directory/contacts'],
                queryParams: undefined,
                extras: undefined,
              },
            ]);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should display red toast when fail', async () => {
      const { getShowToastActionsDispatched, contactsService, store } =
        testSetup();
      jest
        .spyOn(contactsService, 'delete')
        .mockReturnValue(throwError(() => new Error('500')));

      await store.dispatch(new ContactsActions.Delete(mockContact));

      expect(contactsService.delete).toHaveBeenCalledWith(mockContact.Id);
      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: TOAST_MESSAGES.CONTACT_NOT_DELETED(),
          config: undefined,
        },
      ]);
    });
  });

  describe('PatchContact', () => {
    it('should display error message when fail', async () => {
      const { getShowToastActionsDispatched, store, contactsService } =
        testSetup();
      jest
        .spyOn(contactsService, 'save')
        .mockReturnValue(throwError(() => new Error('test')));

      await store.dispatch(new ContactsActions.Patch({ FamilyName: 'Test' }));

      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: TOAST_MESSAGES.CONTACT_NOT_UPDATED(),
          config: undefined,
        },
      ]);
    });
  });

  describe('TransferOwnership', () => {
    it('should display success toast when success', (done) => {
      const {
        actions$,
        getShowToastActionsDispatched,
        store,
        contactsService,
      } = testSetup();
      jest.spyOn(contactsService, 'transferOwner').mockReturnValue(of({}));
      jest.spyOn(contactsService, 'query').mockReturnValue(of({}));

      store.dispatch(
        new ContactsActions.TransferOwnership(
          {
            Id: 1,
            Name: 'current contact',
          } as Contact,
          { Id: 1, Name: 'new owner' }
        )
      );

      actions$
        .pipe(ofActionSuccessful(ContactsActions.TransferOwnership))
        .subscribe(() => {
          try {
            const toastActions = getShowToastActionsDispatched();
            expect(toastActions).toEqual([
              {
                payload: TOAST_MESSAGES.CONTACT_TRANSFERRED('new owner'),
                config: undefined,
              },
            ]);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should reload data and navigate to the contacts list', (done) => {
      const {
        actions$,
        getNavigateActionsDispatched,
        getSearchActionsDispatched,
        store,
        contactsService,
      } = testSetup();
      jest.spyOn(contactsService, 'transferOwner').mockReturnValue(of({}));
      jest.spyOn(contactsService, 'query').mockReturnValue(of({}));

      store.dispatch(
        new ContactsActions.TransferOwnership(
          {
            Id: 1,
            Name: 'current contact',
          } as Contact,
          { Id: 1, Name: 'test' }
        )
      );

      actions$
        .pipe(ofActionSuccessful(ContactsActions.TransferOwnership))
        .subscribe(() => {
          try {
            const navigateActions = getNavigateActionsDispatched();
            expect(navigateActions).toEqual([
              {
                path: ['/directory/contacts'],
                extras: undefined,
                queryParams: undefined,
              },
            ]);
            const searchActions = getSearchActionsDispatched();
            expect(searchActions.length).toBe(1);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should display red toast when fail', async () => {
      const { getShowToastActionsDispatched, store, contactsService } =
        testSetup();
      jest
        .spyOn(contactsService, 'transferOwner')
        .mockReturnValue(throwError(() => new Error('500')));

      await store.dispatch(
        new ContactsActions.TransferOwnership(
          {
            Id: 1,
            Name: 'current contact',
          } as Contact,
          { Id: 0, Name: 'test' }
        )
      );

      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: TOAST_MESSAGES.CONTACT_NOT_TRANSFERRED('current contact'),
          config: undefined,
        },
      ]);
    });
  });
});
