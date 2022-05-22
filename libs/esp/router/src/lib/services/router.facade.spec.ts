import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import {
  NgxsRouterPluginModule,
  RouterStateModel as RouterStateOuterModel,
} from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { RouterStateModel } from '../store';
import { RouterFacade } from './router.facade';

describe('RouterFacade', () => {
  let facade: RouterFacade;
  let store: Store;
  let state: RouterStateOuterModel<RouterStateModel>;
  let spectator: SpectatorService<RouterFacade>;
  const createService = createServiceFactory({
    service: RouterFacade,
    imports: [
      RouterModule.forRoot([]),
      NgxsModule.forRoot(),
      NgxsRouterPluginModule.forRoot(),
    ],
    providers: [RouterFacade, { provide: APP_BASE_HREF, useValue: '' }],
  });

  beforeEach(() => {
    spectator = createService();
    facade = spectator.service;
    store = spectator.inject(Store);

    state = {
      state: {
        url: 'test1',
        params: { test: 1 },
        queryParams: { test: 2 },
        data: { test: 3 },
      },
      trigger: null!,
    };
  });

  it('creates a facade', () => {
    expect(facade).toBeTruthy();
  });

  /*
    it('gives data from store', done => {
        facade.data$.subscribe(res => {
            expect(res).toMatchObject(state.state.data);

            done();
        });

        store.reset(state);
    });

    it('gives params from store', done => {
        facade.params$.subscribe(res => {
            expect(res).toMatchObject(state.state.params);

            done();
        });

        store.reset(state);
    });

    it('gives queryParams from store', done => {
        facade.queryParams$.subscribe(res => {
            expect(res).toMatchObject(state.state.queryParams);

            done();
        });

        store.reset(state);
    });

    it('gives url from store', done => {
        facade.url$.subscribe(res => {
            expect(res).toMatchObject(state.state.url);

            done();
        });

        store.reset(state);
    });
    */
});
