import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastActions } from '@cosmos/components/notification';
import { NgxsActionCollector } from '@cosmos/testing';
import { CompaniesService } from '@esp/companies';
import { ContactsService } from '@esp/contacts';
import { createServiceFactory } from '@ngneat/spectator';
import {
  Actions,
  NgxsModule,
  ofActionErrored,
  ofActionSuccessful,
  Store,
} from '@ngxs/store';
import { EMPTY, of, throwError } from 'rxjs';
import { ProjectCreateWithNewCustomerActions } from '../actions';
import { ProjectsApiService } from '../api/projects-api.service';
import { ProjectCreateWithNewCustomerState } from './project-create-with-new-customer.state';
import { TOAST_MESSAGES } from './toast-messages';
import { WebsiteTypeEnum } from '@esp/models';
import { ProjectsState } from './projects.state';

describe('ProjectCreateWithNewCustomerState', () => {
  const createService = createServiceFactory({
    service: Store,
    imports: [
      NgxsModule.forRoot([ProjectCreateWithNewCustomerState, ProjectsState]),
      NgxsActionCollector.collectActions(),
      HttpClientTestingModule,
      RouterTestingModule,
    ],
    providers: [
      ProjectsApiService,
      ContactsService,
      CompaniesService,
      ProjectCreateWithNewCustomerState,
    ],
  });

  const testSetup = () => {
    const spectator = createService();
    const actions$ = spectator.inject(Actions);

    const http = spectator.inject(HttpTestingController);

    const store = spectator.inject(Store);

    const state = spectator.inject(ProjectCreateWithNewCustomerState);

    const projectsService = spectator.inject(ProjectsApiService);
    const contactsService = spectator.inject(ContactsService);
    const companiesService = spectator.inject(CompaniesService);

    const actionCollector = spectator.inject(NgxsActionCollector);
    const actionsDispatched = actionCollector.dispatched;
    const payload = {
      customer: {
        CompanyInformation: {
          Id: 0,
          IsCustomer: true,
          Name: 'Test',
          GivenName: 'Test',
          FamilyName: 'Test',
          PrimaryEmail: {
            Id: 0,
            IsPrimary: true,
            Type: 'Work',
            Address: 'test@test.com',
          },
          Address: {
            Line1: 'New BEL Rd',
            Line2: '',
            City: 'Bengaluru',
            State: 'KA',
            PostalCode: '',
            CountryType: 'IN',
          },
          Phone: {
            Country: 'USA',
            Id: 0,
            IsPrimary: false,
            Number: '+48 443 443 433',
            PhoneCode: '1',
            Type: 'Office',
          },
          IsAcknowledgementContact: true,
          IsBillingContact: true,
          IsShippingContact: true,
        },
        BrandInformation: {
          Websites: {
            IsPrimary: true,
            Type: WebsiteTypeEnum.Other,
            Url: 'www.test.pl',
          },
          PrimaryBrandColor: '#80a0dc',
          LogoMediaLink: '',
          IconMediaLink: '',
        },
      },
      project: {
        Name: 'test',
        EventType: 'Advertising',
        InHandsDate: '2021-10-18T22:00:00.000Z',
        EventDate: '2021-10-16T22:00:00.000Z',
        Budget: '111.00',
        NumberOfAssignees: '111',
      },
      productIds: [1],
    } as any;
    const customerPayload = (
      state as any
    ).mapProjectCreateCustomerFormToCompany({
      ...payload.customer,
      Id: 123,
    });

    const contactPayload = (state as any).mapProjectCreateCustomerFormToContact(
      payload.customer,
      customerPayload.Id
    );

    const projectPayload = (state as any).mapProjectDetailsFormToProject(
      payload.project,
      customerPayload
    );
    function getDispatchedActionsOfType<T>(actionType: Type<T>): T[] {
      return actionsDispatched.filter((item) => item instanceof actionType);
    }

    return {
      spectator,
      store,
      http,
      projectsService,
      companiesService,
      contactsService,
      state,
      actions$,
      actionsDispatched,
      payload,
      customerPayload,
      contactPayload,
      projectPayload,
      getShowToastActionsDispatched: () =>
        getDispatchedActionsOfType(ToastActions.Show),
    };
  };

  it('Store should be created', () => {
    const { store } = testSetup();
    expect(store).toBeTruthy();
  });

  describe('Project Create With New Customer State Actions', () => {
    it('should call createCustomer, createContact, createProject after dispatching CreateProjectWithNewCustomer', (done) => {
      const {
        state,
        store,
        payload,
        contactPayload,
        customerPayload,
        projectPayload,
        projectsService,
        getShowToastActionsDispatched,
        actions$,
      } = testSetup();

      jest.spyOn(projectsService, 'create').mockReturnValue(EMPTY);

      jest
        .spyOn(state as any, 'performCreateContactRequest')
        .mockReturnValue(of(contactPayload));

      jest
        .spyOn(state as any, 'assignContactToCustomer')
        .mockReturnValue(of(''));

      jest
        .spyOn(state as any, 'performCreateCustomerRequest')
        .mockReturnValue(of(customerPayload));

      const createCustomer = jest.spyOn(state as any, 'createCustomer');

      const createContact = jest.spyOn(state as any, 'createContact');

      const createProject = jest.spyOn(state as any, 'createProject');

      store.dispatch(
        new ProjectCreateWithNewCustomerActions.CreateProjectWithNewCustomer(
          payload
        )
      );

      actions$
        .pipe(
          ofActionSuccessful(
            ProjectCreateWithNewCustomerActions.CreateProjectWithNewCustomer
          )
        )
        .subscribe(() => {
          try {
            expect(createCustomer).toHaveBeenCalled();
            expect(createContact).toHaveBeenCalled();
            expect(createProject).toHaveBeenCalled();
            const toastActions = getShowToastActionsDispatched();
            expect(toastActions).toEqual([
              {
                payload: TOAST_MESSAGES.COMPANY_CREATED(customerPayload.Name),
                config: undefined,
              },
              {
                payload: TOAST_MESSAGES.CONTACT_CREATED(
                  `${contactPayload.GivenName} ${contactPayload.FamilyName}`
                ),
                config: undefined,
              },
              {
                payload: TOAST_MESSAGES.PROJECT_CREATED(
                  projectPayload.Name,
                  customerPayload.Name
                ),
                config: undefined,
              },
            ]);
          } finally {
            done();
          }
        });
    });

    it('should dispatch customer toast error on fail creating customer', (done) => {
      const {
        state,
        store,
        companiesService,
        payload,
        getShowToastActionsDispatched,
        actions$,
      } = testSetup();
      jest
        .spyOn(companiesService, 'create')
        .mockReturnValue(throwError(() => new Error('test')));

      const createContact = jest.spyOn(state as any, 'createContact');
      const createProject = jest.spyOn(state as any, 'createProject');

      store.dispatch(
        new ProjectCreateWithNewCustomerActions.CreateProjectWithNewCustomer(
          payload
        )
      );

      actions$
        .pipe(
          ofActionErrored(
            ProjectCreateWithNewCustomerActions.CreateProjectWithNewCustomer
          )
        )
        .subscribe(() => {
          const toastActions = getShowToastActionsDispatched();
          expect(toastActions).toEqual([
            {
              payload: TOAST_MESSAGES.COMPANY_NOT_CREATED(),
              config: undefined,
            },
          ]);
          expect(createContact).not.toHaveBeenCalled();
          expect(createProject).not.toHaveBeenCalled();
          done();
        });
    });

    it('should dispatch contact toast error on fail creating contact', (done) => {
      const {
        state,
        store,
        contactsService,
        payload,
        customerPayload,
        actions$,
        getShowToastActionsDispatched,
      } = testSetup();
      const createProject = jest.spyOn(state as any, 'createProject');

      jest
        .spyOn(state as any, 'createCustomer')
        .mockReturnValue(customerPayload);

      jest
        .spyOn(contactsService, 'create')
        .mockReturnValue(throwError(() => new Error('test')));

      store.dispatch(
        new ProjectCreateWithNewCustomerActions.CreateProjectWithNewCustomer(
          payload
        )
      );

      actions$
        .pipe(
          ofActionErrored(
            ProjectCreateWithNewCustomerActions.CreateProjectWithNewCustomer
          )
        )
        .subscribe(() => {
          const toastActions = getShowToastActionsDispatched();
          expect(toastActions).toEqual([
            {
              payload: TOAST_MESSAGES.CONTACT_NOT_CREATED(),
              config: undefined,
            },
          ]);
          expect(createProject).not.toHaveBeenCalled();
          done();
        });
    });

    it('should dispatch project toast error on fail creating project', (done) => {
      const {
        state,
        store,
        projectsService,
        customerPayload,
        contactPayload,
        actions$,
        payload,
        getShowToastActionsDispatched,
      } = testSetup();

      jest
        .spyOn(projectsService, 'create')
        .mockReturnValue(throwError(() => new Error('test')));

      jest
        .spyOn(state as any, 'createCustomer')
        .mockReturnValue(customerPayload);

      jest.spyOn(state as any, 'createContact').mockReturnValue(contactPayload);

      store.dispatch(
        new ProjectCreateWithNewCustomerActions.CreateProjectWithNewCustomer(
          payload
        )
      );

      actions$
        .pipe(
          ofActionErrored(
            ProjectCreateWithNewCustomerActions.CreateProjectWithNewCustomer
          )
        )
        .subscribe(() => {
          const toastActions = getShowToastActionsDispatched();
          try {
            expect(toastActions).toEqual([
              {
                payload: TOAST_MESSAGES.PROJECT_NOT_CREATED(),
                config: undefined,
              },
            ]);
          } finally {
            done();
          }
        });
    });
  });
});
