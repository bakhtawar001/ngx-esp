import { InjectionToken } from '@angular/core';

export const SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'Cosmos REST Service Configuration',
  {
    providedIn: 'root',
    factory: () => new ServiceConfig(),
  }
);

export class ServiceConfig {
  Url = '';

  constructor(...options: Partial<ServiceConfig>[]) {
    Object.assign(this, ...options);
  }
}
