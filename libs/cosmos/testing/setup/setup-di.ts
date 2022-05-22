import { ɵɵdefineInjectable } from '@angular/core';
import {
  MATERIAL_SANITY_CHECKS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

import { enUS } from 'date-fns/locale';

// We shouldn't do Material sanity checks within unit tests, since they're needed only during the development.
// This warns `Could not find Angular Material core theme. Most Material components may not work as expected`.
// We're not able to provide the `MATERIAL_SANITY_CHECKS` token everywhere in all test files, it's easier to
// override the provider definition only once.
(
  MATERIAL_SANITY_CHECKS as unknown as {
    ɵprov: unknown;
  }
).ɵprov = ɵɵdefineInjectable({
  token: MATERIAL_SANITY_CHECKS,
  providedIn: 'root',
  factory: () => false,
});

// We don't want to provide the `MAT_DATE_LOCALE` in test files since we're only using the `enUS` locale. We could've
// used the `defineGlobalInjections` but not all tests are using spectator.
(
  MAT_DATE_LOCALE as unknown as {
    ɵprov: unknown;
  }
).ɵprov = ɵɵdefineInjectable({
  token: MAT_DATE_LOCALE,
  providedIn: 'root',
  factory: () => enUS,
});
