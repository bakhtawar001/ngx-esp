import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { ServiceConfig } from '@cosmos/common';
import { RestClient } from '@esp/common/http';
import { Supplier } from '@smartlink/suppliers';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  KeywordPrefix,
  KeywordSuggestions,
} from '../../../../../smartlink/models/src';
import { SearchResult, SupplierSearchCriteria } from '../models';

export const SIRIUS_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'Sirius Service Configuration',
  {
    providedIn: 'root',
    factory: () =>
      new ServiceConfig({
        Url: 'https://asiservice.asicentral.com/babou/api/sirius',
      }),
  }
);

@Injectable({
  providedIn: 'root',
})
export class SuppliersService extends RestClient<Supplier> {
  override url = 'suppliers';

  constructor(
    @Inject(SIRIUS_SERVICE_CONFIG)
    protected override config: ServiceConfig,
    protected override http: HttpClient
  ) {
    super(config, http);
  }
  search<TSearchView>(
    criteria?: SupplierSearchCriteria
  ): Observable<SearchResult<TSearchView>> {
    return this.http.post<SearchResult<TSearchView>>(`${this.uri}/search`, {
      ...criteria,
    });
  }

  getKeywordSuggestions(
    parameters: KeywordPrefix
  ): Observable<KeywordSuggestions[]> {
    const params = new HttpParams()
      .append('terms', parameters.prefix)
      .append('count', parameters.limit);

    return this.http
      .get<string[]>(`${this.uri}/suggestion`, { params: params })
      .pipe(
        map((results) =>
          results.map((keyword) => ({
            KeywordForDisplay: keyword,
            KeywordForSearch: keyword,
          }))
        )
      );
  }
}
