import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { NgxsModule, Store } from '@ngxs/store';
import { AccountState } from '../store';
import { AccountFacade } from './account.facade';
import { AccountService } from './account.service';

describe('AccountFacade', () => {
  let accountFacade: AccountFacade;
  let store: Store;
  let http: HttpTestingController;
  let service: AccountService;
  let spectator: SpectatorService<AccountFacade>;
  const createService = createServiceFactory({
    service: AccountFacade,
    imports: [HttpClientTestingModule, NgxsModule.forRoot([AccountState])],
    providers: [AccountFacade],
  });

  beforeEach(() => {
    spectator = createService();
    accountFacade = spectator.service;
    store = spectator.inject(Store);
    http = spectator.inject(HttpTestingController);
    service = spectator.inject(AccountService);
  });

  it('should create', () => {
    expect(accountFacade).toBeTruthy();
  });

  describe('selectors', () => {
    it('Should return searches observable from $searches', () => {
      expect(accountFacade.searches$).toBeTruthy();
    });
  });

  // describe('searches', () => {
  //   it('should dispatch LoadSearches and return observable', () => {
  //     const spy = spyOn(store, 'dispatch');

  //     const observable = accountFacade.searches();

  //     expect(spy).toHaveBeenCalled();

  //     expect(observable).toBeTruthy();
  //   });
  // });
});
