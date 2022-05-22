import { InjectionToken } from '@angular/core';
import { ServiceConfig } from '@cosmos/common';

export const ZEAL_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'Zeal Service Configuration',
  {
    providedIn: 'root',
    factory: () =>
      new ServiceConfig({
        Url: 'https://asiservice.asicentral.com/babou/api/zeal',
      }),
  }
);
