import 'jest-preset-angular/setup-jest';
import '__mocks__/googlePlacesMock';

import { NG_EVENT_PLUGINS } from '@cosmos/ng-event-plugins';

import { defineGlobalsInjections } from '@ngneat/spectator';

defineGlobalsInjections({
  providers: [NG_EVENT_PLUGINS],
  teardown: {
    destroyAfterEach: true,
  },
});
