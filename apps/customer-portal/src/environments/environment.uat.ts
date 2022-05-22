import { requestStartsWith } from '@asi/auth';

const ASICENTRAL_DOMAIN = 'uat-asicentral.com';

export const environment = {
  production: true,
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
  },
  rollbar: {
    accessToken: 'e5afad46022b42bcbe3aa014bfc34a60',
    captureUncaught: true,
    captureUnhandledRejections: true,
    environment: 'uat',
  },
  ASISERVICE_API: `https://asiservice.${ASICENTRAL_DOMAIN}`,
  SMARTLINK_API: `https://api.${ASICENTRAL_DOMAIN}/v1`,
  ZEAL_API: `https://asiservice.${ASICENTRAL_DOMAIN}/babou/api/zeal`,

  WespAuthorizationHeader:
    'Basic MTc3OjRkOWZhZmJjYTBkZDdiYTFiMTdiZWJhZjUxZjM4MDVm',
};
