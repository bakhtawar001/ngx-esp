import {
  Inject,
  InjectionToken,
  Injector,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';

import type { HeapIoConfig } from './types';

export const HEAP_SERVICE_CONFIG = new InjectionToken<HeapIoConfig>('heap');

@NgModule()
export class HeapIoModule {
  constructor(
    injector: Injector,
    @Inject(HEAP_SERVICE_CONFIG) config: HeapIoConfig
  ) {
    config.enabled &&
      import(/* webpackChunkName: 'heap-io' */ './heap-io').then((m) =>
        injector.get(m.HeapIoService).start(config)
      );
  }

  static forRoot(config: HeapIoConfig): ModuleWithProviders<HeapIoModule> {
    return {
      ngModule: HeapIoModule,
      providers: [
        {
          provide: HEAP_SERVICE_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
