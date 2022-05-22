import { fakeAsync } from '@angular/core/testing';
import { CollaboratorsDialogService } from '@asi/collaborators/ui/feature-core';
import { dataCySelector } from '@cosmos/testing';
import { Project } from '@esp/models';
import { SEARCH_LOCAL_STATE } from '@esp/search';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockComponent, MockProvider } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { ProjectCloseDialogResult } from '../../dialogs/project-close/models/dialog.model';
import { PROJECT_SEARCH_LOCAL_STATE } from '../../local-states';
import { ProjectsDialogService } from '../../services';
import {
  ProjectDetailsCardComponent,
  ProjectDetailsCardModule,
} from '../project-details-card';
import {
  ProjectsListComponent,
  ProjectsListModule,
} from './projects-list.component';

const selectors = {
  noProjects: dataCySelector('no-projects'),
  loader: dataCySelector('loader'),
};
const mockedProject = {
  Id: 1,
  Customer: {
    Id: 1,
    Name: 'Customer 1',
    IconImageUrl: 'testUrl',
  },
  Name: 'Project 3',
  StepName: 'Negotiating & Pitching',
  CreateDate: new Date(2014, 11, 16),
  IsActive: true,
} as any;

describe('ProjectsListComponent', () => {
  const createComponent = createComponentFactory({
    component: ProjectsListComponent,
    imports: [ProjectsListModule, NgxsModule.forRoot()],
    overrideModules: [
      [
        ProjectDetailsCardModule,
        {
          set: {
            declarations: [MockComponent(ProjectDetailsCardComponent)],
            exports: [MockComponent(ProjectDetailsCardComponent)],
          },
        },
      ],
    ],
    providers: [
      MockProvider(CollaboratorsDialogService),
      MockProvider(ProjectsDialogService),
    ],
  });

  const testSetup = (options?: {
    projects?: Partial<Project>[];
    loading?: boolean;
    loaded?: boolean;
  }) => {
    const stateMock = {
      tabs: [{ name: 'All' }, { name: 'Shared with me' }],
      connect: () => of(this),
      search: () => EMPTY,
      closeProject: (project) => EMPTY,
      reopenProject: (project) => EMPTY,
      transferOwnership: (project, userId) => EMPTY,
      isLoading: options?.loading !== undefined ? options.loading : false,
      hasLoaded: options?.loaded !== undefined ? options.loaded : true,
      projects:
        options?.projects !== undefined ? options.projects : [{ Id: 1 }],
    };

    const spectator = createComponent({
      providers: [
        {
          provide: PROJECT_SEARCH_LOCAL_STATE,
          useValue: stateMock,
        },
        {
          provide: SEARCH_LOCAL_STATE,
          useValue: stateMock,
        },
      ],
    });

    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { spectator } = testSetup();

    expect(spectator).toBeTruthy();
  });

  describe('Not found section', () => {
    it('should be visible when no projects found and loaded and not loading', () => {
      const { spectator } = testSetup({
        projects: [],
        loaded: true,
        loading: false,
      });

      expect(spectator.query(selectors.noProjects)).toBeTruthy();
    });

    it('should not be visible when no projects found but loading', () => {
      const { spectator } = testSetup({
        projects: [],
        loaded: false,
        loading: true,
      });

      expect(spectator.query(selectors.noProjects)).not.toBeTruthy();
    });
  });

  describe('Loader', () => {
    it('should be visible when projects are loading', () => {
      const { spectator } = testSetup({
        projects: [],
        loaded: false,
        loading: true,
      });

      expect(spectator.query(selectors.loader)).toBeTruthy();
    });

    it('should not be visible when projects are already loaded', () => {
      const { spectator } = testSetup({
        projects: [],
        loaded: true,
        loading: false,
      });

      expect(spectator.query(selectors.loader)).not.toBeTruthy();
    });
  });

  describe('Transfer ownership', () => {
    it('Should open transfer ownership dialog and call state.transferOwnership on success', fakeAsync(() => {
      const { spectator, component } = testSetup();

      const collaboratorsDialogService = spectator.inject(
        CollaboratorsDialogService
      );
      const spyFn = jest
        .spyOn(collaboratorsDialogService, 'openTransferOwnershipDialog')
        .mockReturnValue(of(<any>{ Id: 10000 }));

      const spyStateTransferOwnership = jest.spyOn(
        component.state,
        'transferOwnership'
      );

      component.onTransferOwnership(mockedProject);
      spectator.tick();

      expect(spyFn).toHaveBeenCalledWith({
        entity: mockedProject,
      });
      expect(spyStateTransferOwnership).toHaveBeenCalled();
    }));

    it('Should open transfer ownership dialog and call state.transferOwnership when Id <= 0', () => {
      const { spectator, component } = testSetup();

      const collaboratorsDialogService = spectator.inject(
        CollaboratorsDialogService
      );
      const spyFn = jest
        .spyOn(collaboratorsDialogService, 'openTransferOwnershipDialog')
        .mockReturnValue(of(<any>{ Id: 0 }));

      const spyStateTransferOwnership = jest.spyOn(
        component.state,
        'transferOwnership'
      );

      component.onTransferOwnership(mockedProject);
      expect(spyFn).toHaveBeenCalledWith({
        entity: mockedProject,
      });
      expect(spyStateTransferOwnership).not.toHaveBeenCalled();
    });
  });

  describe('Close/reopen project', () => {
    it('Should open CloseProjectDialog and dispatch ProjectSearchActions.CloseProject action', fakeAsync(() => {
      const { spectator, component } = testSetup();

      const mockedPayload = {
        Project: mockedProject,
        Note: 'test note',
        Resolution: 'test resolution',
      } as any;

      const stateSpy = jest.spyOn(component.state, 'closeProject');
      const projectsDialogService = spectator.inject(ProjectsDialogService);
      const spyFn = jest
        .spyOn(projectsDialogService, 'openCloseProjectDialog')
        .mockReturnValue(
          of(<ProjectCloseDialogResult>{
            Note: mockedPayload.Note,
            Resolution: mockedPayload.Resolution,
          })
        );

      component.onCloseProject(mockedProject);
      spectator.tick();

      expect(spyFn).toHaveBeenCalled();
      expect(stateSpy).toHaveBeenCalled();
    }));

    it('Should dispatch ProjectSearchActions.ReopenProject', () => {
      const { component } = testSetup();

      const stateSpy = jest.spyOn(component.state, 'reopenProject');

      component.onReopenProject(mockedProject);

      expect(stateSpy).toHaveBeenCalled();
    });
  });
});
