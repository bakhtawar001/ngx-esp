import { Provider } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import {
  PreventEventPlugin,
  SilentEventPlugin,
  StopEventPlugin,
} from '@tinkoff/ng-event-plugins';

// By default, all plugins will be bundled within the production file.
// E.g.we don't use the `BindPlugin` or `InitPlugin`, which waits for the `NgZone.onStable` before calling the handler.
// This tiny library is used to tree-shake unused plugins.

export const NG_EVENT_PLUGINS: Provider[] = [
  {
    provide: EVENT_MANAGER_PLUGINS,
    useClass: PreventEventPlugin,
    multi: true,
  },
  {
    provide: EVENT_MANAGER_PLUGINS,
    useClass: SilentEventPlugin,
    multi: true,
  },
  {
    provide: EVENT_MANAGER_PLUGINS,
    useClass: StopEventPlugin,
    multi: true,
  },
];
