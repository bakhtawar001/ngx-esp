import { InjectionToken } from '@angular/core';
import { ServiceConfig } from '@cosmos/common';

export const ASISERVICE_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'ASI Service Configuration',
  {
    providedIn: 'root',
    factory: () =>
      new ServiceConfig({
        Url: 'https://asiservice.asicentral.com',
      }),
  }
);
