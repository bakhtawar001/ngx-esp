import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, NgxsModule, Store } from '@ngxs/store';
import { Search } from '../models';
import { AccountService } from '../services';
import { LoadSearchesSuccess } from './actions';
import { AccountState } from './state';

describe('AccountState', () => {
  let actions$;
  let http;
  let state;
  let store;

  let accountService;
  let spectator: SpectatorService<AccountService>;
  const createService = createServiceFactory({
    service: AccountService,
    imports: [HttpClientTestingModule, NgxsModule.forRoot([AccountState])],
    providers: [AccountService],
  });
  beforeEach(() => {
    spectator = createService();

    actions$ = spectator.inject(Actions);

    http = spectator.inject(HttpTestingController);

    store = spectator.inject(Store);

    state = {
      searches: [],
    };

    accountService = spectator.service;

    store.reset({ account: state });
  });

  it('Creates a store', () => {
    expect(store).toBeTruthy();
  });

  describe('Selectors', () => {
    it('Returns searches on selecting getSearches', () => {
      const searches = store.selectSnapshot(AccountState.getSearches);

      expect(searches).toBe(state.searches);
    });
  });

  describe('Commands', () => {
    /*
    it('Calls account service recentSearches and dispatches event', (done) => {
      const spy = spyOn(accountService, 'recentSearches').and.callThrough();

      actions$
        .pipe(ofActionSuccessful(LoadSearchesSuccess))
        .subscribe((action) => {
          expect(action).toBeTruthy();

          expect(spy).toHaveBeenCalled();

          done();
        });

      store.dispatch(new LoadSearches());

      const res = http.expectOne(`${accountService.uri}/recent_searches`);

      res.flush([]);

      http.verify();
    });
    */
  });

  describe('Events', () => {
    it('patches state on loadSearchesSuccess', () => {
      const searches: Search[] = [
        {
          Id: 1,
          Name: 'test',
          UpdateDate: '',
        },
      ];

      store.dispatch(new LoadSearchesSuccess(searches));

      const localSearches = store.selectSnapshot(AccountState.getSearches);

      expect(localSearches).toEqual(searches);
    });
  });
});
