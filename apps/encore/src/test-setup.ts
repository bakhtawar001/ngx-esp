import '@cosmos/testing/setup';

import { InteractivityChecker } from '@angular/cdk/a11y';
import { defineGlobalsInjections } from '@ngneat/spectator';
import { mockProvider } from '@ngneat/spectator/jest';

import {
  ExplicitFeatureFlagsService,
  FeatureFlagsModule,
} from '@cosmos/feature-flags';
import { NG_EVENT_PLUGINS } from '@cosmos/ng-event-plugins';
import { CosAnalyticsService } from '@cosmos/analytics';

defineGlobalsInjections({
  imports: [FeatureFlagsModule.forRoot(ExplicitFeatureFlagsService)],
  providers: [
    NG_EVENT_PLUGINS,
    ExplicitFeatureFlagsService.provideWithConfig({
      directory: true,
      mmp: true,
      orders: true,
      presentations: true,
      projects: true,
    }),
    {
      provide: InteractivityChecker,
      useValue: {
        isFocusable: () => true,
      },
    },
    mockProvider(CosAnalyticsService),
  ],
  teardown: {
    destroyAfterEach: true,
  },
});
