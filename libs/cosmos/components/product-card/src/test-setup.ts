import '@cosmos/testing/setup';

import {
  ExplicitFeatureFlagsService,
  FeatureFlagsModule,
} from '@cosmos/feature-flags';
import { defineGlobalsInjections } from '@ngneat/spectator';

defineGlobalsInjections({
  imports: [FeatureFlagsModule.forRoot(ExplicitFeatureFlagsService)],
  providers: [
    ExplicitFeatureFlagsService.provideWithConfig({
      directory: true,
      mmp: true,
      orders: true,
      presentations: true,
      projects: true,
    }),
  ],
  teardown: {
    destroyAfterEach: true,
  },
});
