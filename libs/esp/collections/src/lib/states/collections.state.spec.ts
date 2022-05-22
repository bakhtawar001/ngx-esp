import { HttpHeaders, HttpResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { CosAnalyticsService, TrackEvent } from '@cosmos/analytics';
import { ToastActions } from '@cosmos/components/notification';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { NgxsActionCollector } from '@cosmos/testing';
import { CollectionMockDb } from '@esp/collections/mocks';
import {
  CollectionArchivedEvent,
  CollectionTransferredEvent,
} from '@esp/products';
import { createServiceFactory, mockProvider } from '@ngneat/spectator/jest';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, NgxsModule, Store } from '@ngxs/store';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ProductsMockDb } from '@smartlink/products/mocks';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  CollectionProductsActions,
  CollectionsActions,
  RecentCollectionsActions,
} from '../actions';
import { CollectionsService } from '../services/collections.service';
import { CollectionsState, CollectionsStateModel } from './collections.state';
import {
  Collection,
  CollectionProductSearchResultItem,
  CollectionProductsState,
  CollectionProductsStateModel,
  CollectionSearch,
  CollectionSearchStateModel,
  CollectionsSearchState,
  RecentCollectionsState,
  RecentCollectionsStateModel,
} from '../../index';
import { SearchResult } from '@esp/models';

const mockCollections: Collection[] = CollectionMockDb.Collections.slice(0, 2);
const mockProducts = ProductsMockDb.products.slice(0, 5);

describe('CollectionsState', () => {
  const createService = createServiceFactory({
    service: CollectionsState,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot([
        CollectionsState,
        CollectionsSearchState,
        CollectionProductsState,
        RecentCollectionsState,
      ]),
      NgxsActionCollector.collectActions(),
    ],
    providers: [
      HttpClientTestingModule,
      mockProvider(CollectionsService),
      mockProvider(CosAnalyticsService),
    ],
  });

  const testSetup = (options?: {
    withCollection?: boolean;
    withProducts?: boolean;
  }) => {
    const spectator = createService();

    let defaultState: {
      collections?: CollectionsStateModel;
      collectionsSearch?: CollectionSearchStateModel;
      collectionProducts?: CollectionProductsStateModel;
      recentCollections?: RecentCollectionsStateModel;
    } = {};

    let collections: Record<number, Collection>;
    let collectionsState: CollectionsStateModel;
    let collectionsSearchState: CollectionSearchStateModel;

    let products: SearchResult<CollectionProductSearchResultItem>;
    let collectionProductsState: CollectionProductsStateModel;
    let recentCollectionsState: RecentCollectionsStateModel;

    if (options?.withCollection) {
      collections = mockCollections.reduce(
        (object, collection) => ({ ...object, [collection.Id]: collection }),
        {}
      );

      collectionsState = {
        total: mockCollections.length,
        items: collections,
        itemIds: Object.keys(collections).map((id) => parseInt(id)),
        currentId: mockCollections[0].Id,
      };

      collectionsSearchState = {
        total: mockCollections.length,
        items: mockCollections as CollectionSearch[],
        criteria: null,
      };

      defaultState = {
        ...defaultState,
        collections: collectionsState,
        collectionsSearch: collectionsSearchState,
      };
    }

    if (options?.withProducts) {
      products = {
        Results: [...mockProducts],
        ResultsTotal: mockProducts.length,
      };

      collectionProductsState = {
        products,
        total: products.ResultsTotal || 0,
      };

      recentCollectionsState = {
        items: [...mockProducts],
        loading: null,
      };

      defaultState = {
        ...defaultState,
        collectionProducts: collectionProductsState,
        recentCollections: recentCollectionsState,
      };
    }
    const actions$ = spectator.inject(Actions);

    const http = spectator.inject(HttpTestingController);

    const store = spectator.inject(Store);

    store.reset(defaultState);

    const actionCollector = spectator.inject(NgxsActionCollector);
    const actionsDispatched = actionCollector.dispatched;
    function getDispatchedActionsOfType<T>(actionType: Type<T>): T {
      return actionsDispatched.find((item) => item instanceof actionType);
    }

    return {
      spectator,
      store,
      http,
      actions$,
      actionsDispatched,
      products,
      collections,
      currentCollectionId: collectionsState?.currentId,
      getShowToastActionsDispatched: () =>
        getDispatchedActionsOfType(ToastActions.Show),
      getRecentCollectionsLoadDispatched: () =>
        getDispatchedActionsOfType(RecentCollectionsActions.Get),
      getNavigateActionsDispatched: () => getDispatchedActionsOfType(Navigate),
      getRemoveSuccessActionsDispatched: () =>
        getDispatchedActionsOfType(CollectionProductsActions.RemoveSuccess),
    };
  };

  it('creates a store', () => {
    const { store } = testSetup();
    expect(store).toBeTruthy();
  });

  it("User should be displayed with the success message when collection deleted as 'Success!' with subtext '[Collection name] has been deleted'", fakeAsync(() => {
    // Arrange
    const {
      store,
      spectator,
      getShowToastActionsDispatched,
      getRecentCollectionsLoadDispatched,
      getNavigateActionsDispatched,
      collections,
      currentCollectionId,
    } = testSetup({
      withCollection: true,
    });
    tick();
    const service = spectator.inject(CollectionsService);

    jest
      .spyOn(service, 'delete')
      .mockReturnValue(of(collections[currentCollectionId]));

    // Act
    store.dispatch(
      new CollectionsActions.Delete(collections[currentCollectionId])
    );

    // Assert
    const recentCollectionsLoad = getRecentCollectionsLoadDispatched();
    const toastActions = getShowToastActionsDispatched();
    const navigateAction = getNavigateActionsDispatched();
    expect(recentCollectionsLoad).toBeDefined();
    expect(toastActions).toEqual({
      payload: {
        title: 'Success!',
        body: `${collections[currentCollectionId].Name} has been deleted.`,
        type: 'confirm',
      },
      config: undefined,
    });
    expect(navigateAction).toEqual({
      path: ['/collections'],
      queryParams: undefined,
      extras: undefined,
    });
    const collectionsArr = Object.values(collections);

    const state: {
      collections: CollectionsStateModel;
      collectionsSearch: CollectionSearchStateModel;
    } = store.snapshot();

    const expectedState = {
      total: collectionsArr.length - 1,
      items: collectionsArr.filter((coll) => coll.Id !== currentCollectionId),
      criteria: null,
    };

    expect(state.collectionsSearch).toEqual(expectedState);
  }));

  it("If system fails to delete a collection, message should be displayed as 'Error!' with subtext '[Collection name] was not deleted'", () => {
    // Arrange
    const {
      store,
      spectator,
      getShowToastActionsDispatched,
      collections,
      currentCollectionId,
    } = testSetup({ withCollection: true });
    const service = spectator.inject(CollectionsService);
    jest
      .spyOn(service, 'delete')
      .mockReturnValue(throwError(() => new Error('test')));

    // Act
    store.dispatch(
      new CollectionsActions.Delete(collections[currentCollectionId])
    );

    // Assert
    const toastActions = getShowToastActionsDispatched();

    expect(toastActions).toEqual({
      payload: {
        title: 'Error!',
        body: `${collections[currentCollectionId].Name} was not deleted.`,
        type: 'error',
      },
      config: undefined,
    });
  });

  it("Success Toast displayed correctly as 'Success!' with subtext '1 product deleted.', when a single product is removed from the collection", fakeAsync(() => {
    // Arrange
    const {
      store,
      spectator,
      getRecentCollectionsLoadDispatched,
      getShowToastActionsDispatched,
      getRemoveSuccessActionsDispatched,
      products,
      collections,
      currentCollectionId,
    } = testSetup({
      withCollection: true,
      withProducts: true,
    });
    tick();
    const service = spectator.inject(CollectionsService);

    jest.spyOn(service, 'removeProducts').mockReturnValue(
      of(
        new HttpResponse({
          body: {},
        })
      )
    );

    jest.spyOn(service, 'searchRecent').mockReturnValue(of(products as any));

    // Act
    store.dispatch(
      new CollectionProductsActions.Remove(
        collections[currentCollectionId].Id,
        [products?.Results?.[0].Id]
      )
    );

    // Assert
    const recentCollectionsLoad = getRecentCollectionsLoadDispatched();
    const toastActions = getShowToastActionsDispatched();
    const removeSuccessActions = getRemoveSuccessActionsDispatched();

    expect(toastActions).toEqual({
      payload: {
        title: 'Success!',
        body: '1 product deleted.',
        type: 'confirm',
      },
      config: undefined,
    });
    expect(recentCollectionsLoad).toBeDefined();
    expect(removeSuccessActions).toEqual({
      id: collections[currentCollectionId].Id,
      productIds: [products?.Results?.[0].Id],
    });
    const state = store.snapshot();
    expect(state.recentCollections).toEqual({
      items: products.Results,
      loading: null,
    });
  }));

  it("In case an error encountered while deleting products error toast should be displayed as 'Error!' with subtext 'Product(s) were not deleted'", fakeAsync(() => {
    // Arrange
    const {
      store,
      spectator,
      getShowToastActionsDispatched,
      collections,
      products,
      currentCollectionId,
    } = testSetup({
      withCollection: true,
      withProducts: true,
    });
    tick();
    const service = spectator.inject(CollectionsService);
    const prevState = store.snapshot();
    jest
      .spyOn(service, 'removeProducts')
      .mockReturnValue(throwError(() => new Error('test')));

    // Act
    store.dispatch(
      new CollectionProductsActions.Remove(
        collections[currentCollectionId].Id,
        [products?.Results?.[0].Id]
      )
    );

    // Assert
    const toastActions = getShowToastActionsDispatched();

    expect(toastActions).toEqual({
      payload: {
        title: 'Error!',
        body: 'Product(s) not deleted.',
        type: 'error',
      },
      config: undefined,
    });
    const state = store.snapshot();
    expect(state).toEqual(prevState);
  }));

  it("Success toast should be displayed when status is updated to Archive with Text as 'Collection [collection name] Archived!' and with subtext as 'You may still access [collection name] for your list of archived collections!'", fakeAsync(() => {
    // Arrange
    const {
      store,
      spectator,
      getShowToastActionsDispatched,
      getRecentCollectionsLoadDispatched,
      collections,
      currentCollectionId,
    } = testSetup({
      withCollection: true,
    });
    tick();
    const service = spectator.inject(CollectionsService);

    jest
      .spyOn(service, 'updateStatus')
      .mockReturnValue(of(collections[currentCollectionId]));

    // Act
    store.dispatch(
      new CollectionsActions.SaveStatus(
        collections[currentCollectionId],
        'Archived'
      )
    );

    // Assert
    const recentCollectionsLoad = getRecentCollectionsLoadDispatched();
    const toastActions = getShowToastActionsDispatched();
    expect(toastActions).toEqual({
      payload: {
        title: `Collection ${collections[currentCollectionId].Name} Archived!`,
        body: `You may still access ${collections[currentCollectionId].Name} for your list of archived collections!`,
        type: 'confirm',
      },
      config: undefined,
    });
    expect(recentCollectionsLoad).toBeDefined();
  }));

  it("'Collection Archived' stat event should be recorded when a collection's status is updated as 'Archived'", fakeAsync(() => {
    // Arrange
    const { store, spectator, collections, currentCollectionId } = testSetup({
      withCollection: true,
    });
    tick();
    const service = spectator.inject(CollectionsService);
    jest
      .spyOn(service, 'updateStatus')
      .mockReturnValue(of(collections[currentCollectionId]));

    const analyticsService = spectator.inject(CosAnalyticsService);
    const fnTrackStatEvent = jest
      .spyOn(analyticsService, 'track')
      .mockImplementation();

    // Act
    store.dispatch(
      new CollectionsActions.SaveStatus(
        collections[currentCollectionId],
        'Archived'
      )
    );

    // Assert
    const stat: TrackEvent<CollectionArchivedEvent> = {
      action: 'Collection Archived',
      properties: {
        id: collections[currentCollectionId].Id,
        name: collections[currentCollectionId].Name,
      },
    };

    expect(fnTrackStatEvent).toHaveBeenCalledWith(stat);
  }));

  it("'Collection Deleted' stat event should be recorded when a collection is deleted", fakeAsync(() => {
    // Arrange
    const { store, spectator, collections, currentCollectionId } = testSetup({
      withCollection: true,
    });
    tick();
    const service = spectator.inject(CollectionsService);
    jest
      .spyOn(service, 'delete')
      .mockReturnValue(of(collections[currentCollectionId]));

    const analyticsService = spectator.inject(CosAnalyticsService);
    const fnTrackStatEvent = jest
      .spyOn(analyticsService, 'track')
      .mockImplementation();

    // Act
    store.dispatch(
      new CollectionsActions.Delete(collections[currentCollectionId])
    );

    // Assert
    const stat: TrackEvent<CollectionArchivedEvent> = {
      action: 'Collection Deleted',
      properties: {
        id: collections[currentCollectionId].Id,
        name: collections[currentCollectionId].Name,
      },
    };

    expect(fnTrackStatEvent).toHaveBeenCalledWith(stat);
  }));

  it("'Collection Transferred' stat event should be recorded when a collection's ownership is transferred", fakeAsync(() => {
    // Arrange
    const { store, spectator, collections, currentCollectionId } = testSetup({
      withCollection: true,
    });
    tick();
    const service = spectator.inject(CollectionsService);
    jest
      .spyOn(service, 'transferOwner')
      .mockReturnValue(of(collections[currentCollectionId]));

    const analyticsService = spectator.inject(CosAnalyticsService);
    const fnTrackStatEvent = jest
      .spyOn(analyticsService, 'track')
      .mockImplementation();

    const ownerId = 1;
    // Act
    store.dispatch(
      new CollectionsActions.TransferOwner(
        collections[currentCollectionId],
        ownerId
      )
    );

    // Assert
    const stat: TrackEvent<CollectionTransferredEvent> = {
      action: 'Collection Transferred',
      properties: {
        id: collections[currentCollectionId].Id,
        name: collections[currentCollectionId].Name,
        userId: ownerId,
      },
    };
    expect(fnTrackStatEvent).toHaveBeenCalledWith(stat);
  }));

  it("Proper message should be displayed as below when unable to change the collection status to archive. Title as 'Error archiving collection!', with Subtext 'There was an error archiving [collection name]'", fakeAsync(() => {
    // Arrange
    const {
      store,
      spectator,
      getShowToastActionsDispatched,
      collections,
      currentCollectionId,
    } = testSetup({
      withCollection: true,
    });
    tick();
    const service = spectator.inject(CollectionsService);
    jest
      .spyOn(service, 'updateStatus')
      .mockReturnValue(throwError(() => new Error('test')));

    // Act
    store.dispatch(
      new CollectionsActions.SaveStatus(
        collections[currentCollectionId],
        'Archived'
      )
    );

    // Assert
    const toastActions = getShowToastActionsDispatched();
    expect(toastActions).toEqual({
      payload: {
        title: 'Error archiving collection!',
        body: `There was an error archiving ${collections[currentCollectionId].Name}`,
        type: 'error',
      },
      config: undefined,
    });
  }));

  it('Should start polling HTTP services when the product has been removed successfully', fakeAsync(() => {
    // Arrange
    const {
      store,
      spectator,
      products,
      collections,
      currentCollectionId,
      getRecentCollectionsLoadDispatched,
    } = testSetup({
      withCollection: true,
      withProducts: true,
    });
    tick();
    const service = spectator.inject(CollectionsService);

    jest.spyOn(service, 'removeProducts').mockReturnValue(
      of(
        new HttpResponse({
          body: {},
          headers: new HttpHeaders().append(
            'algoliataskids',
            JSON.stringify({
              uat_collection: products.Results[0].Id,
            })
          ),
        })
      )
    );

    jest.spyOn(service, 'waitUntilAllTasksArePublished').mockReturnValue(
      of([
        {
          PendingTask: true,
          Status: 'published' as const,
        },
      ]).pipe(delay(service.pollingPeriod))
    );

    // Act
    store.dispatch(
      new CollectionProductsActions.Remove(
        collections[currentCollectionId].Id,
        [products.Results[0].Id]
      )
    );

    // Assert
    expect(getRecentCollectionsLoadDispatched()).toBeDefined();
  }));
});
