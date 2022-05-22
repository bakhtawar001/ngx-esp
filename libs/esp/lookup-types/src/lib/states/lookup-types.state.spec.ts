import { createObservableResult, NgxsActionCollector } from '@cosmos/testing';
import { AuthFacade, User } from '@esp/auth';
import { createServiceFactory, mockProvider } from '@ngneat/spectator/jest';
import { Actions, NgxsModule, Store } from '@ngxs/store';
import { LookupsActions } from '../actions';
import { TagType } from '../models';
import { LookupTypeQueries } from '../queries/lookup-type.queries';
import {
  LookupApiModel,
  LookupsApiService,
  LookupTypesApiService,
} from '../services';
import {
  createLookupsApiResult,
  createOrderStatus,
  createTagType,
} from '../testing';
import { LookupTypesState } from './lookup-types.state';

describe('LookupTypesState', () => {
  const createStoreService = createServiceFactory({
    service: Store,
    imports: [
      NgxsActionCollector.collectActions(),
      NgxsModule.forRoot([LookupTypesState]),
    ],
  });

  function setup(
    options: {
      delayUserSetup?: boolean;
      includeInitialLookups?: boolean;
    } = {}
  ) {
    const getLookups_Result = createObservableResult<LookupApiModel>();
    const getTagTypes_Result = createObservableResult<TagType[]>();
    const getUsers_Result = createObservableResult<User>({ multiValue: true });

    const spectator = createStoreService({
      providers: [
        mockProvider(LookupsApiService, {
          getLookups: () => getLookups_Result.get$(),
        }),
        mockProvider(LookupTypesApiService, {
          getTagTypes: () => getTagTypes_Result.get$(),
        }),
        mockProvider(AuthFacade, {
          get user() {
            return getUsers_Result.get$();
          },
          profile$: getUsers_Result.get$(),
        }),
      ],
    });

    if (!options.delayUserSetup) {
      getUsers_Result.next(new User({ Id: 123 }));
    }

    if (options.includeInitialLookups) {
      getLookups_Result.next(
        createLookupsApiResult({
          OrderStatuses: [createOrderStatus()],
        })
      );

      getTagTypes_Result.next([createTagType()]);
    }

    const actions$ = spectator.inject(Actions);
    const store = spectator.inject(Store);
    const actionCollector = spectator.inject(NgxsActionCollector);
    const actionsDispatched = actionCollector.dispatched;

    return {
      store,
      actions$,
      setLookupsApiResult: getLookups_Result.next,
      setTagTypesApiResult: getTagTypes_Result.next,
      setUsersApiResult: getUsers_Result.next,
      actionsDispatched,
    };
  }

  it(`should dispatch Lookups.LoadAll once user is present`, () => {
    // Arrange
    const { actionsDispatched, setUsersApiResult } = setup({
      delayUserSetup: true,
    });
    const user = new User({ Id: 234 });
    // Act
    setUsersApiResult(user);
    // Assert
    const action = actionsDispatched.find(
      (item) => item instanceof LookupsActions.LoadAll
    );
    expect(action).toBeDefined();
  });

  it(`should dispatch Lookups.ClearAll if user is not present`, () => {
    // Arrange
    const { actionsDispatched, setUsersApiResult } = setup({
      delayUserSetup: true,
    });
    // Act
    setUsersApiResult(null);
    // Assert
    const action = actionsDispatched.find(
      (item) => item instanceof LookupsActions.ClearAll
    );
    expect(action).toBeDefined();
  });

  it(`should dispatch Lookups.ClearAll if user logs out`, () => {
    // Arrange
    const { actionsDispatched, setUsersApiResult } = setup({
      includeInitialLookups: true,
    });
    const actionBefore = actionsDispatched.find(
      (item) => item instanceof LookupsActions.ClearAll
    );
    // Act
    setUsersApiResult(null);
    // Assert
    const actionAfter = actionsDispatched.find(
      (item) => item instanceof LookupsActions.ClearAll
    );
    expect(actionBefore).toBeUndefined();
    expect(actionAfter).toBeDefined();
  });

  describe('Common Lookups', () => {
    it(`should load from API on init`, () => {
      // Arrange
      const sampleOrderStatus = createOrderStatus();
      const lookupsApiResult = createLookupsApiResult({
        OrderStatuses: [sampleOrderStatus],
      });

      const { store, setLookupsApiResult } = setup();
      // Act
      setLookupsApiResult(lookupsApiResult);
      // Assert
      const result = store.selectSnapshot(
        LookupTypeQueries.lookups.OrderStatuses
      );
      expect(result).toEqual([sampleOrderStatus]);
    });

    it(`should be empty before API has returned`, () => {
      // Arrange
      const { store } = setup();
      // Act
      const result = store.selectSnapshot(
        LookupTypeQueries.lookups.OrderStatuses
      );
      // Assert
      expect(result).toEqual([]);
    });

    it(`should clear if user logs out`, () => {
      // Arrange
      const { store, setUsersApiResult } = setup({
        includeInitialLookups: true,
      });
      // Act
      setUsersApiResult(null);
      // Assert
      const result = store.selectSnapshot(
        LookupTypeQueries.lookups.OrderStatuses
      );
      expect(result).toEqual([]);
    });
  });

  describe('Tag Types', () => {
    it(`should load from API on init`, () => {
      // Arrange
      const sampleTagType = createTagType();

      const { store, setTagTypesApiResult } = setup();
      // Act
      setTagTypesApiResult([sampleTagType]);
      // Assert
      const result = store.selectSnapshot(LookupTypeQueries.lookups.TagTypes);
      expect(result).toEqual([sampleTagType]);
    });

    it(`should be empty before API has returned`, () => {
      // Arrange
      const { store } = setup();
      // Act
      const result = store.selectSnapshot(LookupTypeQueries.lookups.TagTypes);
      // Assert
      expect(result).toEqual([]);
    });

    it(`should clear if user logs out`, () => {
      // Arrange
      const { store, setUsersApiResult } = setup({
        includeInitialLookups: true,
      });
      // Act
      setUsersApiResult(null);
      // Assert
      const result = store.selectSnapshot(LookupTypeQueries.lookups.TagTypes);
      expect(result).toEqual([]);
    });

    it(`should reload from API on ReloadTagTypes dispatched`, () => {
      // Arrange
      const { store, setTagTypesApiResult } = setup();
      setTagTypesApiResult([createTagType()]).then.reset();

      const updatedTagType = createTagType();
      setTagTypesApiResult([updatedTagType]);
      // Act
      store.dispatch(new LookupsActions.ReloadTagTypes());
      // Assert
      const result = store.selectSnapshot(LookupTypeQueries.lookups.TagTypes);
      expect(result).toEqual([updatedTagType]);
    });
  });
});
