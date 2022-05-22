import { Injectable } from '@angular/core';
import { HttpRequestOptions } from '@cosmos/common/http';
import { RestClient } from '@smartlink/common/http';
import { Observable } from 'rxjs';
import { Inventory, KeywordSuggestions, Product } from '@smartlink/models';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends RestClient<Product> {
  override url = 'products';

  // Override get to use v2 API for pricing
  override get(
    id: number | string,
    options?: HttpRequestOptions
  ): Observable<Product> {
    return this.http.get<Product>(
      `${this.uri.replace('v1', 'v2')}/${id}`,
      options
    );
  }

  getProductMatrix(id: number, params?: any): Observable<any> {
    return this.http.get(`${this.uri}/${id}/matrix`, { params });
  }

  getProductMedia(id: number, params?: { type: string }): Observable<any> {
    return this.http.get(`${this.uri}/${id}/media`, { params });
  }

  getKeywordSuggestions(params?: any): Observable<KeywordSuggestions[]> {
    return this.http.get<KeywordSuggestions[]>(`${this.uri}/keywords`, {
      params,
    });
  }

  getProductInventory(id: number, params?: any) {
    return this.http.get<Inventory>(`${this.uri}/${id}/inventory`, { params });
  }
}
