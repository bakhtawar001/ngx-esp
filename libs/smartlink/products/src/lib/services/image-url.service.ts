import { Injectable, Inject } from '@angular/core';

import { ServiceConfig } from '@cosmos/common';

import { SMARTLINK_SERVICE_CONFIG } from '@smartlink/common';

@Injectable({
  providedIn: 'root',
})
export class ImageUrlService {
  constructor(
    @Inject(SMARTLINK_SERVICE_CONFIG) protected config: ServiceConfig
  ) {}

  /**
   * @param img
   * @param baseUrl
   */
  getImageUrl(img: string, baseUrl?: string) {
    return `${baseUrl ?? this.config.Url}/${img}?size=large`;
  }
}
