import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { ToastActions } from '@cosmos/components/notification';
import { NgxsActionCollector } from '@cosmos/testing';
import { ProjectClosePayload } from '../models';
import { ProjectsSearchQueries } from '../queries';
import {
  ProjectSearchActions,
  ProjectSharedActions,
  ProjectsRecentActions,
} from '../actions';
import { createServiceFactory, mockProvider } from '@ngneat/spectator/jest';
import { Actions, NgxsModule, Store } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { ProjectsApiService } from '../api/projects-api.service';
import { ProjectsSearchState } from './projects-search.state';
import { BaseProject, SearchCriteria } from '@esp/models';
import { TOAST_MESSAGES } from './toast-messages';

describe('ProjectsSearchState', () => {
  const createService = createServiceFactory({
    service: Store,
    imports: [
      NgxsModule.forRoot([ProjectsSearchState]),
      HttpClientTestingModule,
      NgxsActionCollector.collectActions(),
    ],
    providers: [mockProvider(ProjectsApiService)],
  });

  const testSetup = () => {
    const spectator = createService();
    const store = spectator.inject(Store);
    const service = spectator.inject(ProjectsApiService);
    const actions$ = spectator.inject(Actions);
    const http = spectator.inject(HttpTestingController);
    const state = spectator.inject(ProjectsSearchState);
    service.query.andReturn(
      of({
        Results: [],
      })
    );

    const actionCollector = spectator.inject(NgxsActionCollector);
    const actionsDispatched = actionCollector.dispatched;

    function getDispatchedActionsOfType<T>(actionType: Type<T>): T[] {
      return actionsDispatched.filter((item) => item instanceof actionType);
    }

    return {
      spectator,
      store,
      state,
      http,
      service,
      actions$,
      getShowToastActionsDispatched: () =>
        getDispatchedActionsOfType(ToastActions.Show),
      getLoadRecentProjectsActionsDispatched: () =>
        getDispatchedActionsOfType(ProjectsRecentActions.Load),
    };
  };

  it('Store should be created', () => {
    const { store } = testSetup();
    expect(store).toBeTruthy();
  });

  it('Should use page size of 50 items by default', () => {
    const { store } = testSetup();
    expect(store.selectSnapshot(ProjectsSearchQueries.getCriteria).size).toBe(
      50
    );
  });

  describe('ProjectsSearch State Actions', () => {
    it('should dispatch ProjectsSearchActions.Search with given payload and patch state after successful get request', () => {
      const { service, store } = testSetup();

      const criteria = new SearchCriteria();
      const expectedProjects = [];

      store.dispatch(new ProjectSearchActions.Search(criteria));

      const projects = store.selectSnapshot(ProjectsSearchQueries.getProjects);

      expect(projects).toEqual(expectedProjects);
      expect(service.query).toHaveBeenCalledWith(criteria);
    });

    describe('Closing project', () => {
      it('Should show success toast and dispatch ProjectsRecentActions.Load()', async () => {
        const {
          service,
          store,
          getShowToastActionsDispatched,
          getLoadRecentProjectsActionsDispatched,
        } = testSetup();

        jest.spyOn(service, 'closeProject').mockReturnValue(of(null));

        const closePayload: ProjectClosePayload = {
          Project: { Id: 1, Name: 'Test Project' } as BaseProject,
          Note: 'Test Note',
          Resolution: 'Test Resolution',
        };

        await store.dispatch(
          new ProjectSearchActions.CloseProject(closePayload)
        );

        await store.dispatch(
          new ProjectSharedActions.SearchIndexOperationComplete()
        );

        const toastActions = getShowToastActionsDispatched();

        expect(toastActions).toEqual([
          {
            payload: TOAST_MESSAGES.PROJECT_CLOSED(closePayload.Project),
            config: undefined,
          },
        ]);

        expect(getLoadRecentProjectsActionsDispatched).toBeTruthy();
      });

      it('Should show fail toast', async () => {
        const { service, store, getShowToastActionsDispatched } = testSetup();

        jest
          .spyOn(service, 'closeProject')
          .mockReturnValue(throwError(() => new Error()));

        const closePayload: ProjectClosePayload = {
          Project: { Id: 1, Name: 'Test Project' } as any,
          Note: 'Test Note',
          Resolution: 'Test Resolution',
        };

        await store.dispatch(
          new ProjectSearchActions.CloseProject(closePayload)
        );

        const toastActions = getShowToastActionsDispatched();

        expect(toastActions).toEqual([
          {
            payload: TOAST_MESSAGES.PROJECT_NOT_CLOSED(closePayload.Project),
            config: undefined,
          },
        ]);
      });
    });

    describe('Reopening project', () => {
      it('Should show success toast and dispatch ProjectsRecentActions.Load()', async () => {
        const {
          service,
          store,
          getShowToastActionsDispatched,
          getLoadRecentProjectsActionsDispatched,
        } = testSetup();

        jest.spyOn(service, 'reopenProject').mockReturnValue(of(null));

        const project = { Id: 1, Name: 'Test Project' } as any;

        await store.dispatch(new ProjectSearchActions.ReopenProject(project));

        await store.dispatch(
          new ProjectSharedActions.SearchIndexOperationComplete()
        );

        const toastActions = getShowToastActionsDispatched();

        expect(toastActions).toEqual([
          {
            payload: TOAST_MESSAGES.PROJECT_REOPENED(project),
            config: undefined,
          },
        ]);

        expect(getLoadRecentProjectsActionsDispatched).toBeTruthy();
      });

      it('Should show fail toast', async () => {
        const { service, store, getShowToastActionsDispatched } = testSetup();

        jest
          .spyOn(service, 'reopenProject')
          .mockReturnValue(throwError(() => new Error()));

        const project = { Id: 1, Name: 'Test Project' } as any;

        await store.dispatch(new ProjectSearchActions.ReopenProject(project));

        const toastActions = getShowToastActionsDispatched();

        expect(toastActions).toEqual([
          {
            payload: TOAST_MESSAGES.PROJECT_NOT_REOPENED(project),
            config: undefined,
          },
        ]);
      });
    });
  });
});
