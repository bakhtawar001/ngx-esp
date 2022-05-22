import { ModuleWithProviders, NgModule } from '@angular/core';
import { NGXS_PLUGINS } from '@ngxs/store';

import {
  LogRocketConfig,
  LogRocketService,
  LOGROCKET_SERVICE_CONFIG,
} from './logrocket.service';
import { LogRocketReduxMiddlewarePlugin } from './logrocket-redux-middleware-plugin/logrocket-redux-middleware.plugin';

@NgModule()
export class LogRocketModule {
  constructor(logRocket: LogRocketService) {}

  static forRoot(
    config: LogRocketConfig
  ): ModuleWithProviders<LogRocketModule> {
    return {
      ngModule: LogRocketModule,
      providers: [
        LogRocketService,
        {
          provide: LOGROCKET_SERVICE_CONFIG,
          useValue: config,
        },
        {
          provide: NGXS_PLUGINS,
          useClass: LogRocketReduxMiddlewarePlugin,
          multi: true,
        },
      ],
    };
  }
}
