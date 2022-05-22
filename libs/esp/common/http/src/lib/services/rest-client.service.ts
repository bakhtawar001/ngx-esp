import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ServiceConfig } from '@cosmos/common';
import {
  HttpRequestOptions,
  RestClient as BaseRestClient,
} from '@cosmos/common/http';
import { ESP_SERVICE_CONFIG, TaskStatusResponse } from '@esp/service-configs';
import { SearchCriteria, SearchResult } from '@esp/models';
import { forkJoin, Observable, of, throwError, timer } from 'rxjs';
import { catchError, first, mergeMapTo } from 'rxjs/operators';

@Injectable()
export abstract class RestClient<T = any> extends BaseRestClient<T> {
  protected searchMethod: 'GET' | 'POST' = 'GET';

  // Private
  private _currentNbQueries = 0;
  private _lastQueryIdReceived = -1;
  private _queryId = 0;

  pollingPeriod = 500;

  /**
   * Constructor
   *
   * @param {ServiceConfig} config
   * @param {HttpClient} http
   */
  constructor(
    @Inject(ESP_SERVICE_CONFIG) protected override config: ServiceConfig,
    protected override http: HttpClient
  ) {
    super(config, http);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  query<TSearchView, TSearchAggregations = any>(
    criteria: SearchCriteria = new SearchCriteria(),
    options?: HttpRequestOptions
  ): Observable<SearchResult<TSearchView, TSearchAggregations>> {
    let params = this.getParams(options) || new HttpParams();

    if (this.searchMethod === 'GET') {
      Object.keys(criteria).forEach(function (key) {
        if (typeof (<any>criteria)[key] !== 'undefined') {
          params = params.append(
            key,
            typeof (<any>criteria)[key] === 'object'
              ? JSON.stringify((<any>criteria)[key])
              : (<any>criteria)[key]
          );
        }
      });
    }

    return new Observable<SearchResult<TSearchView, TSearchAggregations>>(
      (subscriber) => {
        const queryId = this._queryId++;

        this._currentNbQueries++;

        const body = this.searchMethod === 'POST' ? criteria : undefined;

        const subscription = this.http
          .request<SearchResult<TSearchView, TSearchAggregations>>(
            this.searchMethod,
            `${this.uri}/search`,
            {
              body,
              params,
            }
          )
          .pipe(catchError((err) => this._searchServiceError(err, queryId)))
          .subscribe((res) => {
            subscriber.next(this._searchServiceResponse(res, queryId));
            subscriber.complete();
          });

        return subscription;
      }
    );
  }

  getTaskStatus(indexName: string, taskId: number) {
    const params = new HttpParams()
      .append('indexName', indexName)
      .append('taskId', taskId);

    return this.http.get<TaskStatusResponse>(
      `${this.prefix}/algolia/taskstatus`,
      { params }
    );
  }

  waitUntilAllTasksArePublished(response: HttpResponse<Object>) {
    // E.g. {​​​​​​ ​"uat_collection": [2531005001], "uat_collectionproduct": [2531006001] }​​​​​​​​
    const allTaskIds: Record<string, number[]> | null = JSON.parse(
      // The browser will not allow to parse the `algoliataskids` header per each request,
      // since it respects the `access-control-expose-headers` header.
      // The `JSON.parse` will return `null` if the provided argument is `null`.
      response.headers.get('algoliataskids') ||
        // This is a hack, but `JSON.parse` actually allows `null` considering the spec.
        (null as unknown as string)
    );

    if (allTaskIds === null || Object.keys(allTaskIds).length === 0) {
      // Don't return `EMPTY` here, we have to emit any value just to allow the `CollectionsState` action handlers
      // to proceed with their flow if there're no Algolia task IDs.
      return of([]);
    } else {
      return this.getPollingRequests(allTaskIds);
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
  private _searchServiceResponse = (res: any, queryId: any) => {
    if (queryId < this._lastQueryIdReceived) {
      // Outdated answer
      return;
    }

    this._currentNbQueries -= queryId - this._lastQueryIdReceived;
    this._lastQueryIdReceived = queryId;

    // if (this._currentNbQueries === 0) this.emit('searchQueueEmpty');

    return res;
  };

  private _searchServiceError = (err: any, queryId: any): Observable<never> => {
    if (queryId < this._lastQueryIdReceived) {
      // Outdated answer
      return of();
    }

    this._currentNbQueries -= queryId - this._lastQueryIdReceived;
    this._lastQueryIdReceived = queryId;

    // if (this._currentNbQueries === 0) this.emit('searchQueueEmpty');
    return throwError(err);
  };

  private getPollingRequests(allTaskIds: Record<string, number[]>) {
    const requests: Observable<TaskStatusResponse>[] = [];

    // The `indexName` is an Algolia index, for instance, `uat_collection`.
    for (const [indexName, taskIds] of Object.entries(allTaskIds)) {
      // Caretaker note: I've used 2 nested for-loops just for readability purposes, it becomes a bit
      // messy and complicated to read with `Object.entries().map(...)`, etc.
      for (const taskId of taskIds) {
        const source$ = this.getTaskStatus(indexName, taskId);
        // We could've used the `timer + switchMap -> forkJoin` but we don't want to make duplicate requests, since "fork-joining"
        // observables will cancel all previous HTTP requests and will fire new requests.
        const request$ = timer(0, this.pollingPeriod).pipe(
          // We could've used the `switchMapTo` here but it has some issues.
          // E.g. if the server doesn't respond in 500 ms then the `timer()` will keep cancelling requests
          // and it'll never end, we'll end up in an infinite loop.
          mergeMapTo(source$),
          first((response) => this.taskIsPublished(response))
        );
        requests.push(request$);
      }
    }

    return forkJoin(requests);
  }

  private taskIsPublished(response: TaskStatusResponse) {
    return response.PendingTask === false && response.Status === 'published';
  }
}
