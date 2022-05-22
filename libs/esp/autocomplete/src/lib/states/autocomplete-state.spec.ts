import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { NgxsModule, Store } from '@ngxs/store';
import { AutocompleteService } from '../services';
import {
  AutocompleteState,
  AutocompleteStateModel,
} from './autocomplete-state';

describe('CompaniesState', () => {
  let spectator: SpectatorService<Store>;
  let state: AutocompleteStateModel;
  let service: AutocompleteService;
  let store: Store;

  const createService = createServiceFactory({
    service: Store,
    imports: [HttpClientTestingModule, NgxsModule.forRoot([AutocompleteState])],
    providers: [AutocompleteService],
  });

  beforeEach(() => {
    state = {
      users: [],
      parties: [],
      usersAndTeams: [],
    };

    spectator = createService();
    store = spectator.inject(Store);
    store.reset({ autocomplete: state });
    service = spectator.inject(AutocompleteService);
  });

  it('Creates a store', () => {
    expect(store).toBeTruthy();
  });

  // @TODO uncomment and add more tests when errors on running 'ng test esp-autocomplete' are fixed
  /* describe('Autocomplete Actions', () => {
    it("should dispatch AutocompleteActions.SearchParties and set parties in state", () => {
      const params = {term: 'test'};
      const response = [{ Id: 123, Name: 'test' }] as any;
      const partiesSpy = jest.spyOn(service, 'parties').mockReturnValue(of(response));

      store.dispatch(new AutocompleteActions.SearchParties(params));

      const result = store.selectSnapshot(AutocompleteQueries.getParties);

      expect(dispatchSpy).toHaveBeenCalledWith(new AutocompleteActions.SearchParties(params));
      expect(result).toBe(result);
      expect(partiesSpy).toHaveBeenCalledWith(params);
    })
  });*/
});
