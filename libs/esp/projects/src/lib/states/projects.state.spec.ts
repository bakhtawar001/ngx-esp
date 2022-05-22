import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastActions } from '@cosmos/components/notification';
import { NgxsActionCollector } from '@cosmos/testing';
import { Project } from '@esp/models';
import { createServiceFactory } from '@ngneat/spectator/jest';
import { Actions, NgxsModule, Store } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { ProjectActions } from '../actions';
import { ProjectsApiService } from '../api/projects-api.service';
import { ProjectsState } from './projects.state';
import { TOAST_MESSAGES } from './toast-messages';
import { Navigate } from '@ngxs/router-plugin';

describe('ProjectsState', () => {
  const createService = createServiceFactory({
    service: Store,
    imports: [
      NgxsModule.forRoot([ProjectsState]),
      NgxsActionCollector.collectActions(),
      HttpClientTestingModule,
      RouterTestingModule.withRoutes([
        { path: 'projects/:id', component: {} as any },
      ]),
    ],
    providers: [ProjectsApiService],
  });

  const testSetup = () => {
    const spectator = createService();

    const actions$ = spectator.inject(Actions);
    const http = spectator.inject(HttpTestingController);
    const router = spectator.inject(Router);
    const store = spectator.inject(Store);
    const state = spectator.inject(ProjectsState);
    const projectsService = spectator.inject(ProjectsApiService);
    const actionCollector = spectator.inject(NgxsActionCollector);
    const actionsDispatched = actionCollector.dispatched;

    function getDispatchedActionsOfType<T>(actionType: Type<T>): T[] {
      return actionsDispatched.filter((item) => item instanceof actionType);
    }

    return {
      spectator,
      store,
      http,
      projectsService,
      router,
      state,
      actions$,
      actionsDispatched,
      getShowToastActionsDispatched: () =>
        getDispatchedActionsOfType<ToastActions.Show>(ToastActions.Show),
      getNavigateActionsDispatched: () =>
        getDispatchedActionsOfType<Navigate>(Navigate),
    };
  };

  it('should be created', () => {
    const { store } = testSetup();
    expect(store).toBeTruthy();
  });

  describe('Project Create', () => {
    it('should display success message when success', async () => {
      const { getShowToastActionsDispatched, store, projectsService } =
        testSetup();
      jest.spyOn(projectsService, 'create').mockReturnValue(
        of({
          Name: 'projectCreate',
          Customer: { Id: 1, Name: 'customerTestCreate' },
        })
      );

      await store.dispatch(
        new ProjectActions.CreateProject(
          {
            Name: 'projectCreate',
            Customer: { Id: 1, Name: 'customerTestCreate' },
          } as Project,
          []
        )
      );

      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: TOAST_MESSAGES.PROJECT_CREATED(
            'projectCreate',
            'customerTestCreate'
          ),
          config: undefined,
        },
      ]);
    });

    it('should navigate to details view when success', async () => {
      const { store, projectsService, getNavigateActionsDispatched } =
        testSetup();
      jest.spyOn(projectsService, 'create').mockReturnValue(
        of({
          Id: 1,
          Name: 'projectTestNavigate',
          Customer: { Id: 1, Name: 'customerTestNavigate' },
        })
      );

      await store.dispatch(
        new ProjectActions.CreateProject(
          {
            Name: 'projectTestNavigate',
            Customer: { Id: 1, Name: 'customerTestNavigate' },
          } as any,
          []
        )
      );

      const navigateAction = getNavigateActionsDispatched();
      expect(navigateAction).toEqual([
        {
          path: ['/projects', 1],
          queryParams: undefined,
          extras: undefined,
        },
      ]);
    });

    it('should display error message when fail', async () => {
      const { getShowToastActionsDispatched, store, projectsService } =
        testSetup();
      jest
        .spyOn(projectsService, 'create')
        .mockReturnValue(throwError(() => new Error('test')));

      await store.dispatch(
        new ProjectActions.CreateProject(
          {
            Name: 'projectTest',
            Customer: { Id: 1, Name: 'customerTest' },
          } as any,
          []
        )
      );

      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: TOAST_MESSAGES.PROJECT_NOT_CREATED(),
          config: undefined,
        },
      ]);
    });

    it('should add project to state', async () => {
      const { store, projectsService } = testSetup();
      jest
        .spyOn(projectsService, 'create')
        .mockReturnValue(of({ Id: 1, Name: 'projectTest' }));

      await store.dispatch(
        new ProjectActions.CreateProject(
          {
            Name: 'projectTest',
            Customer: { Id: 1, Name: 'customerTest' },
          } as any,
          []
        )
      );

      expect(
        store
          .selectSnapshot((state) => state.projects.itemIds)
          .find((itemId) => itemId === 1)
      ).toBeTruthy();
      expect(
        store.selectSnapshot((state) => state.projects.items)[1]
      ).toBeTruthy();
    });
  });

  describe('Project Get', () => {
    it('should set current project', async () => {
      const { store, projectsService } = testSetup();
      jest
        .spyOn(projectsService, 'get')
        .mockReturnValue(of({ Id: 1 } as Project));

      await store.dispatch(new ProjectActions.Get(1));

      expect(store.selectSnapshot((state) => state.projects.currentId)).toBe(1);
    });

    it('should set project in state', async () => {
      const { store, projectsService } = testSetup();
      jest
        .spyOn(projectsService, 'get')
        .mockReturnValue(of({ Id: 1 } as Project));

      await store.dispatch(new ProjectActions.Get(1));

      expect(
        store.selectSnapshot((state) => state.projects.items[1])
      ).toBeTruthy();
      expect(
        store.selectSnapshot((state) =>
          state.projects.itemIds.find((itemId) => itemId === 1)
        )
      ).toBeTruthy();
    });
  });

  describe('Project Update', () => {
    it('should display success message when success', async () => {
      const { getShowToastActionsDispatched, store, projectsService } =
        testSetup();
      jest.spyOn(projectsService, 'update').mockReturnValue(of({ Id: 1 }));

      await store.dispatch(
        new ProjectActions.Update({
          Name: 'projectTest',
          Customer: { Id: 1, Name: 'customerTest' },
        } as any)
      );

      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: TOAST_MESSAGES.PROJECT_FOR_COMPANY_UPDATED(
            'projectTest',
            'customerTest'
          ),
          config: undefined,
        },
      ]);
    });

    it('should display error message when fail', async () => {
      const { getShowToastActionsDispatched, store, projectsService } =
        testSetup();
      jest
        .spyOn(projectsService, 'update')
        .mockReturnValue(throwError(() => new Error('test')));

      await store.dispatch(
        new ProjectActions.Update({
          Name: 'projectTest',
          Customer: { Id: 1, Name: 'customerTest' },
        } as any)
      );

      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: TOAST_MESSAGES.PROJECT_NOT_UPDATED(),
          config: undefined,
        },
      ]);
    });
  });
});
