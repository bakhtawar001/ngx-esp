import { InjectionToken } from '@angular/core';
import { ServiceConfig } from '@cosmos/common';

export const SMARTLINK_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'Smartlink Service Configuration',
  {
    providedIn: 'root',
    factory: () =>
      new ServiceConfig({
        Url: 'https://api.asicentral.com/v1',
      }),
  }
);
