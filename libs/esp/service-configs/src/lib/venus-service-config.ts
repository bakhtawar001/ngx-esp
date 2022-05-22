import { InjectionToken } from '@angular/core';
import { ServiceConfig } from '@cosmos/common';

export const VENUS_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'VENUS Service Configuration',
  {
    providedIn: 'root',
    factory: () =>
      new ServiceConfig({
        Url: 'https://asiservice.asicentral.com/babou/api/venus',
      }),
  }
);
