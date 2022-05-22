import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { ToastActions } from '@cosmos/components/notification';
import { NgxsActionCollector } from '@cosmos/testing';
import { CompaniesMockDb } from '@esp/companies/mocks';
import { ContactsService } from '@esp/contacts';
import { ContactsMockDb } from '@esp/contacts/mocks';
import { createServiceFactory, mockProvider } from '@ngneat/spectator/jest';
import { Navigate } from '@ngxs/router-plugin';
import {
  Actions,
  NgxsModule,
  ofActionDispatched,
  ofActionErrored,
  ofActionSuccessful,
  Store,
} from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { CompaniesActions, CompaniesSearchActions } from '../actions';
import { CompaniesSearchQueries } from '../queries';
import { CompaniesService } from '../services';
import { CompaniesSearchState } from './companies-search.state';
import { CompaniesState } from './companies.state';
import { TOAST_MESSAGES } from './toast-messages';

describe('CompaniesState', () => {
  const createService = createServiceFactory({
    service: Store,
    imports: [
      NgxsModule.forRoot([CompaniesState, CompaniesSearchState]),
      HttpClientTestingModule,
      NgxsActionCollector.collectActions(),
    ],
    providers: [mockProvider(CompaniesService), mockProvider(ContactsService)],
  });

  const testSetup = () => {
    const spectator = createService();

    const actions$ = spectator.inject(Actions);
    const store = spectator.inject(Store);
    const state = spectator.inject(CompaniesState);
    const http = spectator.inject(HttpTestingController);
    const companiesService = spectator.inject(CompaniesService);
    const contactService = spectator.inject(ContactsService);
    const actionCollector = spectator.inject(NgxsActionCollector);
    const actionsDispatched = actionCollector.dispatched;
    const mockCompany = CompaniesMockDb.Companies[0];
    const mockContact = ContactsMockDb.Contacts[0];
    const mockNewOwner = {
      Id: mockCompany.Owner.Id + 1,
      Name: mockCompany.Owner.Name + 'test',
    };

    function getDispatchedActionsOfType<T>(actionType: Type<T>): T[] {
      return actionsDispatched.filter((item) => item instanceof actionType);
    }

    return {
      spectator,
      store,
      state,
      http,
      companiesService,
      contactService,
      actions$,
      actionsDispatched,
      mockCompany,
      mockContact,
      mockNewOwner,
      getShowToastActionsDispatched: () =>
        getDispatchedActionsOfType<ToastActions.Show>(ToastActions.Show),
      getNavigateActionsDispatched: () => getDispatchedActionsOfType(Navigate),
      getCompaniesSearchActionsDispatched: () =>
        getDispatchedActionsOfType<CompaniesSearchActions.Search>(
          CompaniesSearchActions.Search
        ),
    };
  };

  it('should be created', () => {
    const { store } = testSetup();

    expect(store).toBeTruthy();
  });

  describe('Patch', () => {
    it('should display error message when fail', async () => {
      const { getShowToastActionsDispatched, store, companiesService } =
        testSetup();
      jest
        .spyOn(companiesService, 'save')
        .mockReturnValue(throwError(() => new Error('test')));

      await store.dispatch(
        new CompaniesActions.Patch({
          Name: 'companyTest',
        })
      );

      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: TOAST_MESSAGES.COMPANY_NOT_SAVED(),
          config: undefined,
        },
      ]);
    });
  });

  describe('Create', () => {
    it('should add item to company store', async () => {
      const { store, state, mockCompany, mockContact } = testSetup();
      jest
        .spyOn(state as any, 'performCreateCompanyRequest')
        .mockReturnValue(of(mockCompany));
      jest
        .spyOn(state as any, 'performCreateContactRequest')
        .mockReturnValue(of(mockContact));

      await store.dispatch(
        new CompaniesActions.Create({
          ...mockCompany,
          FirstName: mockContact.GivenName,
          LastName: mockContact.FamilyName,
        })
      );

      const stateSnapshot = store.snapshot();

      expect(stateSnapshot.companies.items).toEqual({
        [mockCompany.Id]: mockCompany,
      });
      expect(stateSnapshot.companies.itemIds).toEqual([mockCompany.Id]);
    });

    it('should display success message after success', (done) => {
      const {
        getShowToastActionsDispatched,
        store,
        state,
        mockContact,
        mockCompany,
        actions$,
      } = testSetup();

      jest
        .spyOn(state as any, 'performCreateCompanyRequest')
        .mockReturnValue(of(mockCompany));
      jest
        .spyOn(state as any, 'performCreateContactRequest')
        .mockReturnValue(of(mockContact));

      store.dispatch(new CompaniesActions.Create(mockCompany));

      actions$
        .pipe(ofActionSuccessful(CompaniesActions.Create))
        .subscribe(() => {
          try {
            const toastActions = getShowToastActionsDispatched();
            expect(toastActions).toEqual([
              {
                payload: TOAST_MESSAGES.CREATE_COMPANY_SUCCESS(
                  mockCompany.Name
                ),
                config: undefined,
              },
              {
                payload: TOAST_MESSAGES.CONTACT_CREATED(
                  `${mockContact.GivenName} ${mockContact.FamilyName}`
                ),
                config: undefined,
              },
            ]);
            done();
          } catch (err) {
            done(err);
          }
        });
    });

    it('should display error message after company creation fail', (done) => {
      const {
        getShowToastActionsDispatched,
        store,
        mockCompany,
        companiesService,
        actions$,
      } = testSetup();

      jest
        .spyOn(companiesService, 'create')
        .mockReturnValue(throwError(() => new Error('test')));

      store.dispatch(new CompaniesActions.Create(mockCompany));

      actions$.pipe(ofActionErrored(CompaniesActions.Create)).subscribe(() => {
        try {
          const toastActions = getShowToastActionsDispatched();
          expect(toastActions).toEqual([
            {
              payload: TOAST_MESSAGES.CREATE_COMPANY_FAIL(),
              config: undefined,
            },
          ]);
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('should display error message after contact creation fail', (done) => {
      const {
        getShowToastActionsDispatched,
        store,
        state,
        mockCompany,
        contactService,
        actions$,
      } = testSetup();

      jest
        .spyOn(state as any, 'performCreateCompanyRequest')
        .mockReturnValue(of(mockCompany));

      jest.spyOn(state as any, 'createCompany').mockReturnValue(of({}));

      jest
        .spyOn(contactService, 'create')
        .mockReturnValue(throwError(() => new Error('test')));

      store.dispatch(new CompaniesActions.Create(mockCompany));

      actions$.pipe(ofActionErrored(CompaniesActions.Create)).subscribe(() => {
        try {
          const toastActions = getShowToastActionsDispatched();
          expect(toastActions).toEqual([
            {
              payload: TOAST_MESSAGES.CONTACT_NOT_CREATED(),
              config: undefined,
            },
          ]);
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('should navigate to company when navigate option is true', (done) => {
      const {
        getNavigateActionsDispatched,
        store,
        state,
        mockCompany,
        mockContact,
        actions$,
      } = testSetup();

      jest
        .spyOn(state as any, 'performCreateCompanyRequest')
        .mockReturnValue(of(mockCompany));
      jest
        .spyOn(state as any, 'performCreateContactRequest')
        .mockReturnValue(of(mockContact));

      store.dispatch(new CompaniesActions.Create(mockCompany));

      actions$
        .pipe(ofActionSuccessful(CompaniesActions.Create))
        .subscribe(() => {
          try {
            const navigateActions = getNavigateActionsDispatched();

            expect(navigateActions).toEqual([
              {
                queryParams: undefined,
                extras: undefined,
                path: ['/companies', mockCompany.Id],
              },
            ]);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });

  describe('ToggleStatus', () => {
    it('should display success message after success', async () => {
      const {
        getShowToastActionsDispatched,
        store,
        companiesService,
        mockCompany,
      } = testSetup();

      jest.spyOn(companiesService, 'setStatus').mockReturnValue(of({}));

      await store.dispatch(
        new CompaniesSearchActions.ToggleStatus(
          mockCompany.Id,
          !mockCompany.IsActive
        )
      );

      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: {
            title: `Company is ${
              !mockCompany.IsActive ? 'active' : 'inactive'
            }!`,
            body: `This record has been ${
              !mockCompany.IsActive ? 'made active' : 'deactivated'
            }.`,
            type: 'info',
          },
          config: undefined,
        },
      ]);
    });

    it('should display error message after fail', async () => {
      const {
        getShowToastActionsDispatched,
        store,
        companiesService,
        mockCompany,
      } = testSetup();

      jest
        .spyOn(companiesService, 'setStatus')
        .mockReturnValue(throwError(() => new Error('test')));

      await store.dispatch(
        new CompaniesSearchActions.ToggleStatus(
          mockCompany.Id,
          !mockCompany.IsActive
        )
      );

      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: {
            title: 'Error!',
            body: `This record was not ${
              !mockCompany.IsActive ? 'made active' : 'deactivated'
            } due to an error.`,
            type: 'error',
          },
          config: undefined,
        },
      ]);
    });

    it('should dispatch search after success', (done) => {
      const {
        store,
        mockCompany,
        actions$,
        companiesService,
        getCompaniesSearchActionsDispatched,
      } = testSetup();

      jest.spyOn(companiesService, 'setStatus').mockReturnValue(of({}));

      store.dispatch(
        new CompaniesSearchActions.ToggleStatus(
          mockCompany.Id,
          !mockCompany.IsActive
        )
      );

      actions$
        .pipe(ofActionSuccessful(CompaniesSearchActions.ToggleStatus))
        .subscribe(() => {
          try {
            const searchActions = getCompaniesSearchActionsDispatched();
            expect(searchActions.length).toEqual(1);
            done();
          } catch (err) {
            done(err);
          }
        });
    });
  });

  describe('TransferOwnership', () => {
    it('should dispatch get company after success', (done) => {
      const { actions$, companiesService, mockCompany, mockNewOwner, store } =
        testSetup();
      jest.spyOn(companiesService, 'transferOwner').mockReturnValue(of({}));

      const state = store.snapshot();

      store.reset({
        ...state,
        companies: {
          ...state.companies,
          currentId: mockCompany.Id,
        },
      });

      actions$
        .pipe(ofActionDispatched(CompaniesActions.Get))
        .subscribe((result) => {
          try {
            expect(result).toBeTruthy();
            done();
          } catch (e) {
            done(e);
          }
        });
      store.dispatch(
        new CompaniesActions.TransferOwnership(mockCompany, mockNewOwner)
      );
    });

    it('should display success message after success', (done) => {
      const {
        actions$,
        companiesService,
        mockCompany,
        mockNewOwner,
        store,
        getShowToastActionsDispatched,
      } = testSetup();

      jest.spyOn(companiesService, 'transferOwner').mockReturnValue(of({}));

      actions$
        .pipe(ofActionSuccessful(CompaniesActions.TransferOwnership))
        .subscribe(() => {
          try {
            const toastActions = getShowToastActionsDispatched();

            expect(toastActions).toEqual([
              {
                payload: {
                  title: 'Success: Ownership Transferred!',
                  body: `Ownership has been transferred to ${mockNewOwner.Name}.`,
                  type: 'confirm',
                },
                config: undefined,
              },
            ]);
            done();
          } catch (e) {
            done(e);
          }
        });
      store.dispatch(
        new CompaniesActions.TransferOwnership(mockCompany, mockNewOwner)
      );
    });

    it('should display error message after fail', (done) => {
      const {
        actions$,
        companiesService,
        mockCompany,
        mockNewOwner,
        store,
        getShowToastActionsDispatched,
      } = testSetup();

      jest
        .spyOn(companiesService, 'transferOwner')
        .mockReturnValue(throwError(() => new Error('test')));

      actions$
        .pipe(ofActionSuccessful(CompaniesActions.TransferOwnership))
        .subscribe(() => {
          try {
            const toastActions = getShowToastActionsDispatched();

            expect(toastActions).toEqual([
              {
                payload: {
                  title: 'Failure: Ownership Not Transferred!',
                  body: `Ownership of ${mockNewOwner.Name} was unable to be transferred!`,
                  type: 'error',
                },
                config: undefined,
              },
            ]);
            done();
          } catch (e) {
            done(e);
          }
        });
      store.dispatch(
        new CompaniesActions.TransferOwnership(mockCompany, mockNewOwner)
      );
    });
  });

  describe('Delete', () => {
    it('should display success message after success', (done) => {
      const {
        actions$,
        companiesService,
        store,
        mockCompany,
        getShowToastActionsDispatched,
      } = testSetup();

      jest
        .spyOn(companiesService, 'validateDelete')
        .mockReturnValue(of({ IsDeletable: true }));
      jest.spyOn(companiesService, 'delete').mockReturnValue(of({} as any));

      actions$
        .pipe(ofActionSuccessful(CompaniesActions.Delete))
        .subscribe(() => {
          try {
            const toastActions = getShowToastActionsDispatched();

            expect(toastActions).toEqual([
              {
                config: undefined,
                payload: {
                  title: 'Success: Company deleted!',
                  body: `Company ${mockCompany.Name} has been deleted!`,
                  type: 'confirm',
                },
              },
            ]);
            done();
          } catch (e) {
            done(e);
          }
        });
      store.dispatch(new CompaniesActions.Delete(mockCompany));
    });

    it('should navigate to companies', (done) => {
      const {
        actions$,
        companiesService,
        store,
        mockCompany,
        getNavigateActionsDispatched,
      } = testSetup();

      jest
        .spyOn(companiesService, 'validateDelete')
        .mockReturnValue(of({ IsDeletable: true }));
      jest.spyOn(companiesService, 'delete').mockReturnValue(of({} as any));

      actions$
        .pipe(ofActionSuccessful(CompaniesActions.Delete))
        .subscribe(() => {
          try {
            console.log(store);
            const navigateActions = getNavigateActionsDispatched();

            expect(navigateActions).toEqual([
              {
                queryParams: undefined,
                extras: undefined,
                path: ['directory/companies'],
              },
            ]);
            done();
          } catch (e) {
            done(e);
          }
        });
      store.dispatch(new CompaniesActions.Delete(mockCompany.Id));
    });
  });

  it('Should use page size of 50 items by default', () => {
    const { store } = testSetup();
    expect(store.selectSnapshot(CompaniesSearchQueries.getCriteria).size).toBe(
      50
    );
  });
});
