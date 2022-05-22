import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { ServiceConfig } from '@cosmos/common';
import type { HttpRequestOptions } from '@cosmos/common/http';
import { RestClient } from '@esp/common/http';
import { Product, KeywordPrefix, KeywordSuggestions } from '@smartlink/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AggregateValue,
  AggregationTypes,
  MoreFromSupplierCriteria,
  ProductSearchCriteria,
  RelatedProductsCriteria,
  SearchResult,
  TypeAheadSearchCriteria,
} from '../types';

export const ARDOR_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'Ardor Service Configuration',
  {
    providedIn: 'root',
    factory: () =>
      new ServiceConfig({
        Url: 'https://asiservice.asicentral.com/babou/api/ardor',
      }),
  }
);

const aggregationsToInclude: AggregationTypes[] = [
  'CategoryGroup',
  'CategoryValue',
  'Supplier',
  'Color',
  'ImprintMethod',
  'Material',
  'LineName',
  'Shape',
  'Size',
  'Theme',
  'TradeName',
];

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends RestClient<Product> {
  override url = 'products';

  constructor(
    @Inject(ARDOR_SERVICE_CONFIG) protected override config: ServiceConfig,
    protected override http: HttpClient
  ) {
    super(config, http);
  }

  search<TSearchView>(
    criteria?: ProductSearchCriteria,
    options?: HttpRequestOptions
  ): Observable<SearchResult<TSearchView>> {
    // return super.query<TSearchView>(criteria, options);
    return this.http.post<SearchResult<TSearchView>>(`${this.uri}/search`, {
      AggregationsToInclude: aggregationsToInclude,
      ...criteria,
    });
  }

  facetSearch(
    criteria?: TypeAheadSearchCriteria
  ): Observable<AggregateValue[]> {
    return this.http.post<AggregateValue[]>(`${this.uri}/typeahead`, criteria);
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

  getMoreFromSupplier<TSearchView>(
    params: MoreFromSupplierCriteria
  ): Observable<TSearchView[]> {
    return this.http.get<TSearchView[]>(
      `${this.uri}/morefromsupplier?asino=${params.asiNumber}&count=${params.count}`
    );
  }

  getTrendingInCategory<TSearchView>(
    params: RelatedProductsCriteria
  ): Observable<TSearchView[]> {
    return this.http.get<TSearchView[]>(
      `${this.uri}/trendingincategory?productid=${params.productId}&count=${params.count}`
    );
  }

  getRelatedProducts<TSearchView>(
    params: RelatedProductsCriteria
  ): Observable<TSearchView[]> {
    return this.http.get<TSearchView[]>(
      `${this.uri}/relatedproducts?productid=${params.productId}&count=${params.count}`
    );
  }
}
