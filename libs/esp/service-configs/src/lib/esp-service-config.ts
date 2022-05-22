import { InjectionToken } from '@angular/core';
import { ServiceConfig } from '@cosmos/common';

export const ESP_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'ESP Service Configuration',
  {
    providedIn: 'root',
    factory: () =>
      new ServiceConfig({
        Url: 'https://esp.asicentral.com/v1',
      }),
  }
);
