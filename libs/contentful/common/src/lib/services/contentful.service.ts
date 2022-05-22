import { Injectable } from '@angular/core';
import type { Entry, EntryCollection, ContentfulClientApi } from 'contentful';
import { catchError, map, mergeMap, shareReplay } from 'rxjs/operators';
import { defer, from, Observable, throwError } from 'rxjs';

import { ContentfulError } from '../models/contentful-error.model';

function assertClient(
  client$: Observable<ContentfulClientApi> | null
): asserts client$ is Observable<ContentfulClientApi> {
  if (client$ === null) {
    throw new Error('Contentful client is uninitialized');
  }
}

@Injectable({ providedIn: 'root' })
export class ContentfulService {
  hasClient = false;

  private client$: Observable<ContentfulClientApi> | null = null;

  getEntities(query?: any): Observable<EntryCollection<unknown>> {
    ngDevMode && assertClient(this.client$);

    return this.client$.pipe(
      mergeMap((client) =>
        from(client.getEntries({ ...query })).pipe(
          catchError((error) => throwError(() => this.handleError(error)))
        )
      )
    );
  }

  getEntity(id: string): Observable<Entry<unknown>> {
    ngDevMode && assertClient(this.client$);

    return this.client$.pipe(
      mergeMap((client) =>
        from(client.getEntry(id)).pipe(
          catchError((error) => throwError(() => this.handleError(error)))
        )
      )
    );
  }

  setConfig(
    space: string,
    accessToken: string,
    environment = 'master',
    host?: string
  ) {
    if (space && accessToken) {
      this.client$ = defer(
        () => import(/* webpackChunkName: 'contentful' */ 'contentful')
      ).pipe(
        map((m) =>
          m.createClient({
            host,
            space,
            accessToken,
            environment,
          })
        ),
        shareReplay({ bufferSize: 1, refCount: true })
      );

      this.hasClient = true;
    }
  }

  private handleError = (e) => {
    let error: ContentfulError = {
      type: 'Error',
      id: 'Unknown',
      errorObject: e,
    };

    if (e.sys && e.sys.type === 'Error') {
      error = {
        ...error,
        ...e.sys,
        details: e.details,
      };
    } else if (e) {
      error = {
        ...error,
        details: e.details,
        sys: e.sys,
      };
    }

    return error;
  };
}
