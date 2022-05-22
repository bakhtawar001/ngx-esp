import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { ServiceConfig } from '@cosmos/common';
import { VENUS_SERVICE_CONFIG } from '@esp/service-configs';
import { RestClient } from '@esp/common/http';
import {
  Presentation,
  PresentationProductSortOrder,
  ProductSequence,
} from '@esp/models';

export interface AddProductsResponse {
  Presentation: Presentation;
  ProductsAdded: number[];
  ProductsDuplicated: number[];
  ProductsTruncated: number[];
}

@Injectable({ providedIn: 'root' })
export class PresentationsApiService extends RestClient<Presentation> {
  override url = 'presentations';

  constructor(
    @Inject(VENUS_SERVICE_CONFIG) protected _config: ServiceConfig,
    protected override http: HttpClient
  ) {
    super(_config, http);

    this.searchMethod = 'POST';
  }

  addProducts(presentationId: number, productIds: number[]) {
    return this.http.put<AddProductsResponse>(
      `${this.uri}/${presentationId}/products`,
      productIds.map((ProductId) => ({ ProductId }))
    );
  }

  removeProducts(presentationId: number, productIds: number[]) {
    return this.http.post(
      `${this.uri}/${presentationId}/products/remove`,
      productIds
    );
  }

  removeProduct(presentationId: number, productId: number) {
    return this.http.delete<Presentation>(
      `${this.uri}/${presentationId}/products/${productId}`
    );
  }

  sequenceProducts(presentationId: number, sequence: ProductSequence[]) {
    return this.http.put<Presentation>(
      `${this.uri}/${presentationId}/products/sort`,
      sequence
    );
  }

  sortProducts(
    presentationId: number,
    sortOrder: PresentationProductSortOrder
  ) {
    return this.http.put<Presentation>(
      `${this.uri}/${presentationId}/products/sort/${sortOrder}`,
      {}
    );
  }
}
