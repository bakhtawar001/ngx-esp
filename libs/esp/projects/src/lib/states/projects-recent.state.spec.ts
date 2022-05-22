import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createServiceFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { ProjectsRecentActions } from '../actions';
import { ProjectsApiService } from '../api/projects-api.service';
import { ProjectsRecentQueries } from '../queries';
import {
  ProjectsRecentState,
  ProjectsRecentStateModel,
} from './projects-recent.state';

describe('ProjectsRecentState', () => {
  let store: Store;
  let service: ProjectsApiService;
  let spectator;

  const state: ProjectsRecentStateModel = {
    result: { Results: [] },
  };

  const createService = createServiceFactory({
    service: Store,
    imports: [
      NgxsModule.forRoot([ProjectsRecentState]),
      HttpClientTestingModule,
      RouterTestingModule,
    ],
    providers: [mockProvider(ProjectsApiService)],
  });

  beforeEach(() => {
    spectator = createService();
    store = spectator.inject(Store);
    service = spectator.inject(ProjectsApiService);

    store.reset({
      projectsRecent: { ...state },
    });
  });

  it('Store should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('Projects Recent State Actions', () => {
    describe('Load', () => {
      it('should set data only from searchRecent, if there is 5 or more recent projects', async () => {
        const project = { name: 'test name' } as any;
        jest
          .spyOn(service, 'searchRecent')
          .mockReturnValue(of({ Results: [project], ResultsTotal: 5 } as any));
        jest.spyOn(service, 'query');

        await store.dispatch(new ProjectsRecentActions.Load());

        const recentProjects = store.selectSnapshot(
          ProjectsRecentQueries.getRecents
        );
        expect(service.searchRecent).toHaveBeenCalled();
        expect(service.query).not.toHaveBeenCalled();
        expect(recentProjects).toEqual([project]);
      });

      it('should set data from searchRecent and from query if there is less than 5 recent projects', async () => {
        const recentProject = { name: 'test name' } as any;
        const anotherProject = { name: 'test' } as any;
        jest
          .spyOn(service, 'searchRecent')
          .mockReturnValue(
            of({ Results: [recentProject], ResultsTotal: 1 } as any)
          );
        jest
          .spyOn(service, 'query')
          .mockReturnValue(of({ Results: [anotherProject] } as any));

        await store.dispatch(new ProjectsRecentActions.Load());

        const recentProjects = store.selectSnapshot(
          ProjectsRecentQueries.getRecents
        );
        expect(service.searchRecent).toHaveBeenCalled();
        expect(service.query).toHaveBeenCalledWith({
          excludeList: '',
          size: 4,
        });
        expect(recentProjects).toEqual([recentProject, anotherProject]);
      });
    });

    describe('Search', () => {
      it('should dispatch and patch state after successful request', () => {
        const project = { name: 'test name' } as any;
        const criteria = { term: 'blablabla' } as any;

        jest
          .spyOn(service, 'query')
          .mockReturnValue(of({ Results: [project] } as any));

        store.dispatch(new ProjectsRecentActions.Search(criteria));

        const recentProjects = store.selectSnapshot(
          ProjectsRecentQueries.getRecents
        );

        expect(service.query).toHaveBeenCalledWith(criteria);
        expect(recentProjects).toEqual([project]);
      });
    });
  });
});
