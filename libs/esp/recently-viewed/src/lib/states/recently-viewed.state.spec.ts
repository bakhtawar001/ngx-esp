import { CompaniesMockDb } from '@esp/__mocks__/companies';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { NgxsModule, Store } from '@ngxs/store';
import { RecentsQueries } from '../queries';
import { RecentlyViewedStateModel } from './model';
import { RecentlyViewedState } from './recently-viewed.state';

describe('RecentlyViewedState', () => {
  let store: Store;
  let state: RecentlyViewedStateModel;
  let spectator: SpectatorService<RecentlyViewedState>;
  const createService = createServiceFactory({
    service: RecentlyViewedState,
    imports: [NgxsModule.forRoot([RecentlyViewedState])],
  });

  beforeEach(() => {
    spectator = createService();
    store = spectator.inject(Store);

    state = {
      companies: [CompaniesMockDb.Companies[0]],
      orders: [],
      products: [],
      suppliers: [],
      tasks: [],
    };

    store.reset(state);
  });

  describe('Selectors', () => {
    describe('getCompanies', () => {
      it('returns state.companies', () => {
        const res = RecentsQueries.getCompanies(state);

        expect(res).toEqual(state.companies);
      });
    });
  });

  describe('Actions', () => {});
});
