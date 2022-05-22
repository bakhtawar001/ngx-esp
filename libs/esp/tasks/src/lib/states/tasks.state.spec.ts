import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TasksState } from './tasks.state';
import { TasksSearchState } from './tasks-search.state';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, NgxsModule, Store } from '@ngxs/store';
import { TasksService } from '../services';

describe('TasksState', () => {
  let actions$;
  let http;
  let state;
  let store;
  let service;

  let spectator: SpectatorService<TasksState>;
  const createService = createServiceFactory({
    service: TasksState,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot([TasksState, TasksSearchState]),
    ],
    providers: [TasksService],
  });

  beforeEach(() => {
    spectator = createService();

    actions$ = spectator.inject(Actions);

    http = spectator.inject(HttpTestingController);

    store = spectator.inject(Store);

    service = spectator.inject(TasksService);

    state = {
      error: null,
      pending: false,
      company: {
        test: 1,
      },
    };

    store.reset({ companies: state });
  });

  it('creates a store', () => {
    expect(store).toBeTruthy();
  });
});
