import { Provider } from '@angular/core';
import { ZEAL_SERVICE_CONFIG } from '@esp/collections';
import { ARDOR_SERVICE_CONFIG } from '@esp/products';
import { ALGOLIA_TASKS_SERVICE_CONFIG } from '@esp/search';
import {
  ASISERVICE_SERVICE_CONFIG,
  ESP_SERVICE_CONFIG,
  VENUS_SERVICE_CONFIG,
  VULCAN_SERVICE_CONFIG,
} from '@esp/service-configs';
import { SIRIUS_SERVICE_CONFIG } from '@esp/suppliers';
import { SMARTLINK_SERVICE_CONFIG } from '@smartlink/common';
import { environment } from '../../../environments/environment';

export const SERVICE_CONFIG_PROVIDERS: Provider[] = [
  {
    provide: ALGOLIA_TASKS_SERVICE_CONFIG,
    useValue: { Url: environment.ZEAL_API },
  },
  {
    provide: ARDOR_SERVICE_CONFIG,
    useValue: { Url: environment.ARDOR_API },
  },
  {
    provide: ASISERVICE_SERVICE_CONFIG,
    useValue: { Url: environment.ASISERVICE_API },
  },
  {
    provide: ESP_SERVICE_CONFIG,
    useValue: { Url: environment.API },
  },
  {
    provide: SMARTLINK_SERVICE_CONFIG,
    useValue: { Url: environment.SMARTLINK_API },
  },
  {
    provide: VENUS_SERVICE_CONFIG,
    useValue: { Url: environment.VENUS_API },
  },
  {
    provide: VULCAN_SERVICE_CONFIG,
    useValue: { Url: environment.VULCAN_API },
  },
  {
    provide: ZEAL_SERVICE_CONFIG,
    useValue: { Url: environment.ZEAL_API },
  },
  {
    provide: SIRIUS_SERVICE_CONFIG,
    useValue: { Url: environment.SIRIUS_API },
  },
];
