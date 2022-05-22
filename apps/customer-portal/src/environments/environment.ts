// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { requestStartsWith } from '@asi/auth';

const ASICENTRAL_DOMAIN = 'dev-asicentral.com';

export const environment = {
  production: false,
  API: `https://asiservice.${ASICENTRAL_DOMAIN}/babou/api/esp`,
  auth: {
    Url: `https://authentication.${ASICENTRAL_DOMAIN}`,
    TokenPath: '/oauth2/token',
    StorageStrategy: 'localStorage',
    AuthorizationHeader:
      'Basic NDM5MDpmZmQ5MzgxZjc2N2U0ZjI2Yjg5MTFhN2Q2NzFlOWZiOQ==',
    canIntercept: requestStartsWith([
      `https://asiservice.${ASICENTRAL_DOMAIN}`,
    ]),
  },
  logRocket: {
    appId: 'fa0veu/encore',
    enabled: false,
  },
  rollbar: {
    accessToken: 'e5afad46022b42bcbe3aa014bfc34a60',
    captureUncaught: true,
    captureUnhandledRejections: true,
    environment: 'dev',
    enabled: false,
  },
  ASISERVICE_API: `https://asiservice.${ASICENTRAL_DOMAIN}`,
  SMARTLINK_API: `https://api.${ASICENTRAL_DOMAIN}/v1`,
  ZEAL_API: `https://asiservice.${ASICENTRAL_DOMAIN}/babou/api/zeal`,

  WespAuthorizationHeader:
    'Basic MTc3OjRkOWZhZmJjYTBkZDdiYTFiMTdiZWJhZjUxZjM4MDVm',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
