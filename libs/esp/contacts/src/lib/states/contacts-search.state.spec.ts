import { Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastActions } from '@cosmos/components/notification';
import { NgxsActionCollector } from '@cosmos/testing';
import { ContactsMockDb } from '@esp/contacts/mocks';
import type { ContactSearch } from '@esp/models';
import { createServiceFactory, mockProvider } from '@ngneat/spectator/jest';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, NgxsModule, ofActionSuccessful, Store } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { ContactsSearchActions } from '../actions';
import { ContactsService } from '../services';
import { ContactsSearchState } from './contacts-search.state';
import { ContactsState } from './contacts.state';
import { TOAST_MESSAGES } from './toast-messages';
import { ContactsSearchQueries } from '@esp/contacts';

const mockContact = ContactsMockDb.Contacts[0];

describe('ContactsSearchState', () => {
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
    const state = spectator.inject(ContactsSearchState);
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
      getSearchActionsDispatched: () =>
        getDispatchedActionsOfType<ContactsSearchActions.Search>(
          ContactsSearchActions.Search
        ),
    };
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create', () => {
    const { store } = testSetup();

    expect(store).toBeTruthy();
  });

  describe('Activate', () => {
    it('should display success toast when success', async () => {
      const { getShowToastActionsDispatched, store, contactsService } =
        testSetup();
      jest.spyOn(contactsService, 'setStatus').mockReturnValue(of({}));

      await store.dispatch(
        new ContactsSearchActions.Activate({ Id: 1 } as ContactSearch)
      );

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

      await store.dispatch(
        new ContactsSearchActions.Activate({ Id: 1 } as ContactSearch)
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

  describe('Create', () => {
    const payload = {
      FamilyName: 'FamilyName',
      GivenName: 'GivenName',
      CompanyPayload: {
        Company: {
          Id: '123',
        },
        Title: '123',
      },
      Links: [
        {
          Title: '123',
          To: {
            Id: '123',
          },
        },
      ],
      Id: '123',
    };

    it('should display success toast when success', async () => {
      const {
        getShowToastActionsDispatched,
        store,
        contactsService,
        actionsDispatched,
      } = testSetup();
      jest.spyOn(contactsService, 'create').mockReturnValue(of(payload));

      await store.dispatch(new ContactsSearchActions.Create(payload as any));

      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: TOAST_MESSAGES.CONTACT_CREATED(payload as any),
          config: undefined,
        },
      ]);
      expect(
        actionsDispatched.some(
          (action) => action === new Navigate(['/contacts', payload.Id])
        )
      );
    });

    it('should display red toast when fail', async () => {
      const { getShowToastActionsDispatched, store, contactsService } =
        testSetup();
      jest
        .spyOn(contactsService, 'create')
        .mockReturnValue(throwError(() => new Error('test')));

      await store.dispatch(new ContactsSearchActions.Create(payload as any));

      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: TOAST_MESSAGES.CONTACT_NOT_CREATED(),
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
        new ContactsSearchActions.Deactivate({ Id: 1 } as ContactSearch)
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
        new ContactsSearchActions.Deactivate({ Id: 1 } as ContactSearch)
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

      store.dispatch(new ContactsSearchActions.Delete(mockContact));

      actions$
        .pipe(ofActionSuccessful(ContactsSearchActions.Delete))
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

    it('should reload data from search', (done) => {
      const { actions$, getSearchActionsDispatched, contactsService, store } =
        testSetup();
      jest.spyOn(contactsService, 'delete').mockReturnValue(of({} as any));

      store.dispatch(new ContactsSearchActions.Delete(mockContact));

      actions$
        .pipe(ofActionSuccessful(ContactsSearchActions.Delete))
        .subscribe(() => {
          try {
            const searchActions = getSearchActionsDispatched();
            expect(searchActions.length).toBe(1);
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

      await store.dispatch(new ContactsSearchActions.Delete(mockContact));

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

  describe('TransferOwnership', () => {
    it('should display success toast when success', (done) => {
      const {
        actions$,
        getShowToastActionsDispatched,
        store,
        contactsService,
      } = testSetup();
      jest.spyOn(contactsService, 'transferOwner').mockReturnValue(of({}));

      store.dispatch(
        new ContactsSearchActions.TransferOwnership(
          {
            Id: 1,
            Name: 'current contact',
          } as ContactSearch,
          { Id: 1, Name: 'new owner' }
        )
      );

      actions$
        .pipe(ofActionSuccessful(ContactsSearchActions.TransferOwnership))
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

    it('should reload data', (done) => {
      const { actions$, getSearchActionsDispatched, store, contactsService } =
        testSetup();
      jest.spyOn(contactsService, 'transferOwner').mockReturnValue(of({}));

      store.dispatch(
        new ContactsSearchActions.TransferOwnership(
          {
            Id: 1,
            Name: 'current contact',
          } as ContactSearch,
          { Id: 1, Name: 'new owner' }
        )
      );

      actions$
        .pipe(ofActionSuccessful(ContactsSearchActions.TransferOwnership))
        .subscribe(() => {
          try {
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
        new ContactsSearchActions.TransferOwnership(
          {
            Id: 1,
            Name: 'current contact',
          } as ContactSearch,
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

  it('Should use page size of 50 items by default', () => {
    const { store } = testSetup();
    expect(store.selectSnapshot(ContactsSearchQueries.getCriteria).size).toBe(
      50
    );
  });
});
