import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { RestClient } from '@esp/common/http';
import { PriceGrid } from '@smartlink/models';
import { ServiceConfig } from '@cosmos/common';
import { PresentationProduct } from '@esp/models';
import { VENUS_SERVICE_CONFIG } from '@esp/service-configs';

@Injectable({ providedIn: 'root' })
export class PresentationProductsApiService extends RestClient<PresentationProduct> {
  override url = 'products';

  constructor(
    @Inject(VENUS_SERVICE_CONFIG) protected _config: ServiceConfig,
    protected override http: HttpClient
  ) {
    super(_config, http);
  }

  saveVisibility(productId: number, visibility: boolean) {
    return this.http.put<PresentationProduct>(
      `${this.uri}/${productId}/visibility/${visibility}`,
      {}
    );
  }

  getOriginalPriceGrid(productId: number, priceGridId: number) {
    return this.http.get<PriceGrid>(
      `${this.uri}/${productId}/priceGridOriginal/${priceGridId}`
    );
  }
}
