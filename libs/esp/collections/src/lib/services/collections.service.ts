import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ServiceConfig } from '@cosmos/common';
import { RestClient } from '@esp/common/http';
import { SearchCriteria, SearchResult } from '@esp/models';
import { Observable } from 'rxjs';
import type {
  Collection,
  CollectionProductSearchResultItem,
  CollectionSearch,
  CollectionStatus,
} from '../models';
import { ZEAL_SERVICE_CONFIG } from '../types';

export interface AddProductsResponse {
  Collection: Collection;
  ProductsDuplicated: number[];
  ProductsTruncated: number[];
}

@Injectable({
  providedIn: 'root',
})
export class CollectionsService extends RestClient<Collection> {
  override url = 'collections';

  constructor(
    @Inject(ZEAL_SERVICE_CONFIG) protected override config: ServiceConfig,
    protected override http: HttpClient
  ) {
    super(config, http);
  }

  activate(id: number) {
    return this.http.put<Observable<Collection>>(
      `${this.uri}/${id}/activate`,
      {}
    );
  }

  addProducts(id: number, products: any[]) {
    return this.http.put<AddProductsResponse>(
      `${this.uri}/${id}/products`,
      products
    );
  }

  archive(id: number) {
    return this.http.put<Observable<Collection>>(
      `${this.uri}/${id}/archive`,
      {}
    );
  }

  copy(id: number, data: Collection) {
    return this.http.post<Collection>(`${this.uri}/${id}/copy`, data);
  }

  getProducts(id: number) {
    return this.http.get<Observable<any[]>>(`${this.uri}/${id}/products`);
  }

  removeProducts(id: number, productIds: number[]) {
    return this.http.post(`${this.uri}/${id}/products/remove`, productIds, {
      observe: 'response',
    });
  }

  searchProducts(id: number, criteria: SearchCriteria = new SearchCriteria()) {
    let params = new HttpParams();
    const keys = <Array<keyof typeof criteria>>Object.keys(criteria);

    keys.forEach((key) => {
      if (typeof criteria[key] !== 'undefined') {
        params = params.append(
          key,
          typeof criteria[key] === 'object'
            ? JSON.stringify(criteria[key])
            : criteria[key]
        );
      }
    });

    return this.http.get<SearchResult<CollectionProductSearchResultItem>>(
      `${this.uri}/${id}/productsearch`,
      { params }
    );
  }

  searchRecent(parameters = {}): Observable<SearchResult<CollectionSearch>> {
    let params = new HttpParams();
    const keys = <Array<keyof typeof parameters>>Object.keys(parameters);

    keys.forEach((key) => {
      if (typeof parameters[key] !== 'undefined') {
        params = params.append(
          key,
          typeof parameters[key] === 'object'
            ? JSON.stringify(parameters[key])
            : parameters[key]
        );
      }
    });

    return this.http.get<SearchResult<CollectionSearch>>(
      `${this.uri}/searchrecent`,
      { params }
    );
  }

  transferOwner(id: number, ownerId: number): Observable<Collection> {
    return this.http.put<Collection>(
      `${this.uri}/${id}/newowner/${ownerId}`,
      {}
    );
  }

  updateStatus(id: number, status: CollectionStatus): Observable<Collection> {
    return this.http.put<Collection>(`${this.uri}/${id}/status/${status}`, {});
  }
}
