import { InjectionToken } from '@angular/core';
import { ServiceConfig } from '@cosmos/common';

export const VULCAN_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'VULCAN Service Configuration',
  {
    providedIn: 'root',
    factory: () =>
      new ServiceConfig({
        Url: 'https://asiservice.asicentral.com/babou/api/vulcan',
      }),
  }
);
