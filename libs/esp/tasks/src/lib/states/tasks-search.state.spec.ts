import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TasksService } from '../services';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, NgxsModule, Store } from '@ngxs/store';
import { TasksState } from './tasks.state';
import { TasksSearchState } from './tasks-search.state';

describe('TaskSearchState', () => {
  let actions$;
  let http;
  let store;
  let service;

  let spectator: SpectatorService<TasksSearchState>;
  const createService = createServiceFactory({
    service: TasksSearchState,
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
  });

  it('creates a store', () => {
    expect(store).toBeTruthy();
  });
});
