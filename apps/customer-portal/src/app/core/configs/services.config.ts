import { Provider } from '@angular/core';
import { ZEAL_SERVICE_CONFIG } from '@esp/collections';
import {
  ASISERVICE_SERVICE_CONFIG,
  ESP_SERVICE_CONFIG,
} from '@esp/service-configs';
import { SMARTLINK_SERVICE_CONFIG } from '@smartlink/common';
import { environment } from '../../../environments/environment';

export const SERVICE_CONFIG_PROVIDERS: Provider[] = [
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
    provide: ZEAL_SERVICE_CONFIG,
    useValue: { Url: environment.ZEAL_API },
  },
];
