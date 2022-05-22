import {
  Inject,
  InjectionToken,
  Injector,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';

import type { SegmentConfig } from './types';

export const SEGMENT_CONFIG = new InjectionToken<SegmentConfig>(
  'SegmentConfig'
);

@NgModule()
export class SegmentModule {
  constructor(
    injector: Injector,
    @Inject(SEGMENT_CONFIG) config: SegmentConfig
  ) {
    config.enabled &&
      import(/* webpackChunkName: 'segment' */ './segment').then((m) =>
        injector.get(m.SegmentService).start(config)
      );
  }

  static forRoot(config: SegmentConfig): ModuleWithProviders<SegmentModule> {
    return {
      ngModule: SegmentModule,
      providers: [
        {
          provide: SEGMENT_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
