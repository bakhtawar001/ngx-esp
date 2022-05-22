import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ServiceConfig } from '@cosmos/common';
import {
  CollectionMockDb,
  CollectionSearchResponseMockDb,
} from '@esp/collections/mocks';
import { Observable, of } from 'rxjs';
import { Collection, CollectionStatus } from '../models';
import { ZEAL_SERVICE_CONFIG } from '../types';

@Injectable()
export class CollectionsMockBackendInterceptor implements HttpInterceptor {
  private collections: Collection[];

  constructor(@Inject(ZEAL_SERVICE_CONFIG) private config: ServiceConfig) {
    this.collections = CollectionMockDb.Collections;
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.config.Url) {
      return next.handle(request);
    }

    const { url, method, params } = request;

    console.log(url, method, params);

    if (/collections\/\d+\/?$/.test(url)) {
      const id = parseInt(request.urlWithParams.match(/\d+$/)[0], 10);
      let index = this.collections.findIndex((c) => c.Id === id);

      // Create if not exist
      if (index === -1) {
        this.collections.push({ ...CollectionMockDb.Collections[0], Id: id });

        index = this.collections.length - 1;
      }

      if (method === 'GET') {
        return of(new HttpResponse({ body: this.collections[index] }));
      } else if (method === 'PUT') {
        const collection = this.collections[index];

        this.collections.splice(index, 1, {
          ...collection,
          ...(<Record<string, unknown>>request.body),
        });

        return of(new HttpResponse({ body: this.collections[index] }));
      } else if (method === 'DELETE') {
        const [deleted] = this.collections.splice(index, 1);

        return of(new HttpResponse({ body: deleted }));
      }
    } else if (/collections\/search(-recent)?/.test(url)) {
      const excludeList = params.get('ExcludeList');
      const testExcludeList = params.get('testExcludeList');

      if (excludeList && testExcludeList) {
        return of(
          new HttpResponse({
            body: {
              ...CollectionSearchResponseMockDb.SeededCollectionSearchResponse(
                []
              ),
            },
          })
        );
      }

      return of(
        new HttpResponse({
          body: {
            ...CollectionSearchResponseMockDb.SeededCollectionSearchResponse(
              this.collections
            ),
            /*
            Results: [],
            ResultsTotal: 0,
            */
          },
        })
      );
    } else if (/collections\/\d+\/products(earch)?/.test(url)) {
      const id = parseInt(request.urlWithParams.match(/\d+/)[0], 10);
      const index = this.collections.findIndex((c) => c.Id === id);
      if (method === 'GET') {
        return of(new HttpResponse({ body: this.collections[index].Products }));
      } else {
        console.log(request.body);
        this.collections[index] = {
          ...this.collections[index],
          Products: [
            ...this.collections[index].Products,
            //@ts-ignore
            ...request.body,
          ],
        };

        return of(new HttpResponse({ body: this.collections[index] }));
      }
      // eslint-disable-next-line no-dupe-else-if
    } else if (/collections\/\d+\/?$/.test(url)) {
      const id = parseInt(request.urlWithParams.match(/\d+/)[0], 10);
      const index = this.collections.findIndex((c) => c.Id === id);

      console.log(request.body);

      this.collections[index] = request.body as Collection;

      return of(new HttpResponse({ body: this.collections[index] }));
    } else if (/collections\/\d+\/copy\/?$/.test(url)) {
      const id = parseInt(request.urlWithParams.match(/\d+/)[0], 10);
      const index = this.collections.findIndex((c) => c.Id === id);

      const newCollection = { ...this.collections[index] };

      newCollection.Id = Date.now();

      this.collections.push(newCollection);

      return of(new HttpResponse({ body: newCollection }));
    } else if (/collections\/\d+\/status\/w+$/.test(url)) {
      const id = parseInt(request.urlWithParams.match(/\d+/)[0], 10);
      const index = this.collections.findIndex((c) => c.Id === id);

      this.collections[index].Status = request.urlWithParams.match(
        /\w+$/
      )[0] as CollectionStatus;

      return of(new HttpResponse({ body: this.collections[index] }));
    } else if (/collections\/?$/.test(url)) {
      const Id = Date.now();

      const newCollection = {
        ...CollectionMockDb.Collections[0],
        Products: [],
        Collaborators: [],
        ...(<Record<string, unknown>>request.body),
        Id,
      };

      this.collections.push(newCollection);

      return of(new HttpResponse({ body: newCollection }));
    } else if (/collections\/\d+\/products\/remove\/?$/.test(url)) {
      const id = parseInt(request.urlWithParams.match(/\d+/)[0], 10);
      const index = this.collections.findIndex((c) => c.Id === id);

      const idsToRemove = <number[]>request.body;
      this.collections[index].Products = this.collections[
        index
      ].Products.filter((p) => !idsToRemove.includes(p.Id));

      return of(new HttpResponse());
    } else {
      return next.handle(request);
    }
  }
}
