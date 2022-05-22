import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ServiceConfig } from '@cosmos/common';
import {
  HttpRequestOptions,
  RestClient as BaseRestClient,
} from '@cosmos/common/http';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { SMARTLINK_SERVICE_CONFIG } from '@smartlink/common';
import { SearchCriteria, SearchResult } from '@smartlink/search';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export abstract class RestClient<T = any> extends BaseRestClient<T> {
  // Private
  private _currentNbQueries = 0;
  private _lastQueryIdReceived = -1;
  private _queryId = 0;

  /**
   * Constructor
   *
   * @param {ServiceConfig} config
   * @param {HttpClient} http
   */
  constructor(
    @Inject(SMARTLINK_SERVICE_CONFIG) protected override config: ServiceConfig,
    protected override http: HttpClient
  ) {
    super(config, http);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  query<TResult>(
    criteria: SearchCriteria = new SearchCriteria(),
    options?: HttpRequestOptions
  ): Observable<SearchResult<TResult>> {
    let params = this.getParams(options) || new HttpParams();

    const criteriaKeys = Object.keys(criteria) as Array<keyof SearchCriteria>;
    criteriaKeys.forEach((key: keyof SearchCriteria) => {
      const criteriaValue: string | number | boolean | undefined =
        criteria[key];

      if (criteriaValue === undefined) {
        return;
      }

      const value: string | number | boolean =
        typeof criteriaValue === 'object'
          ? JSON.stringify(criteriaValue)
          : criteriaValue;

      params = params.append(key, `${value}`);
    });

    options = { ...options, params };

    return new Observable((subscriber) => {
      const queryId = this._queryId++;

      this._currentNbQueries++;

      this.http
        .get<SearchResult<TResult>>(`${this.uri}/search.json`, options)
        .pipe(catchError((err) => this._searchServiceError(err, queryId)))
        .subscribe((res) => {
          subscriber.next(this._searchServiceResponse(res, queryId));
          subscriber.complete();
        });
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
  private _searchServiceResponse = <TResult>(
    res: SearchResult<TResult>,
    queryId: number
  ) => {
    if (queryId < this._lastQueryIdReceived) {
      // Outdated answer
      return;
    }

    this._currentNbQueries -= queryId - this._lastQueryIdReceived;
    this._lastQueryIdReceived = queryId;

    // if (this._currentNbQueries === 0) this.emit('searchQueueEmpty');

    return res;
  };

  private _searchServiceError = (
    err: any,
    queryId: number
  ): Observable<never> => {
    if (queryId < this._lastQueryIdReceived) {
      // Outdated answer
      return of();
    }

    this._currentNbQueries -= queryId - this._lastQueryIdReceived;
    this._lastQueryIdReceived = queryId;

    // if (this._currentNbQueries === 0) this.emit('searchQueueEmpty');
    return throwError(() => err);
  };
}
