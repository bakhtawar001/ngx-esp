import { Injectable } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { createServiceFactory, mockProvider } from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';

import { AlgoliaTasksService } from '../services';
import { AlgoliaTasksInterceptor } from './algolia-tasks.interceptor';

describe('AlgoliaTasksInterceptor', () => {
  class MockedActionToDispatch {
    static readonly type = 'Mocked action to dispatch';
    constructor(public body: unknown) {}
  }

  @Injectable()
  class CollectionService {
    constructor(private http: HttpClient) {}

    removeProducts(id: number, productIds: number[]) {
      return this.http.post(`/collections/${id}/products/remove`, productIds, {
        observe: 'response',
      });
    }

    getUsers() {
      return this.http.get('/users', { observe: 'response' });
    }
  }

  let httpTestingController: HttpTestingController;

  const createService = createServiceFactory({
    service: CollectionService,
    imports: [HttpClientTestingModule, NgxsModule.forRoot()],
    providers: [
      AlgoliaTasksInterceptor.create({
        // Any URL.
        urlPattern: /\//,
        actionToDispatch: MockedActionToDispatch,
      }),
    ],
  });

  const testSetup = (algoliaTaskIds: number[] = []) => {
    const spectator = createService({
      providers: [
        mockProvider(AlgoliaTasksService, {
          waitUntilAllTasksArePublished: () => of(algoliaTaskIds),
        }),
      ],
    });
    const store = spectator.inject(Store);
    const collectionService = spectator.inject(CollectionService);
    httpTestingController = spectator.inject(HttpTestingController);
    return {
      spectator,
      store,
      collectionService,
    };
  };

  afterEach(() => {
    // Assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it(`should ignore specific URLs and don't wait for tasks to be published`, () => {
    // Arrange
    const { store, collectionService } = testSetup();

    const id = 1;
    const productIds = [1, 2];
    const spy = jest.spyOn(store, 'dispatch');

    collectionService.removeProducts(id, productIds).subscribe((response) => {
      expect(response.status).toEqual(HttpStatusCode.Ok);
    });

    // Act
    const req = httpTestingController.expectOne(
      `/collections/${id}/products/remove`
    );

    req.flush(
      {},
      {
        headers: new HttpHeaders().set('algoliataskids', []),
      }
    );

    // Assert
    try {
      expect(spy).toHaveBeenCalledTimes(0);
      expect(req.request.method).toEqual('POST');
      expect(req.request.url).toEqual(`/collections/${id}/products/remove`);
    } finally {
      spy.mockRestore();
    }
  });

  it('it should dispatch an action when all tasks have been published and URL is not ignored', () => {
    // Arrange
    const algoliaTaskIds = [1, 2, 3];
    const { store, collectionService } = testSetup(algoliaTaskIds);

    const users = ['Ryan', 'Leigh', 'Mark', 'Artur'];
    const spy = jest.spyOn(store, 'dispatch');

    collectionService.getUsers().subscribe((response) => {
      expect(response).toEqual(users);
    });

    // Act
    const req = httpTestingController.expectOne('/users');

    req.flush(users, {
      headers: new HttpHeaders().set(
        'algoliataskids',
        JSON.stringify(algoliaTaskIds)
      ),
    });

    // Assert
    try {
      expect(req.request.method).toEqual('GET');
      expect(req.request.url).toEqual('/users');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        body: users,
      });
    } finally {
      spy.mockRestore();
    }
  });
});
