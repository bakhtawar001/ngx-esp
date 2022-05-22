import { requestStartsWith } from '@asi/auth';
import {
  AppCuesModule,
  HeapIoModule,
  HotJarModule,
  LogRocketModule,
  RollbarModule
} from '@cosmos/analytics';
import {
  ExplicitFeatureFlagsService,
  FeatureFlagsModule
} from '@cosmos/feature-flags';
import { MetaModule } from '@cosmos/meta';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { getActionTypeFromInstance } from '@ngxs/store';
import { EnvironmentConfig } from '../app/core/types';
import { configOverrides, importOverrides } from './dev-overrides';

const ASICENTRAL_DOMAIN =
  configOverrides.asiCentralDomain || `dev-asicentral.com`;

export const environment: EnvironmentConfig = {
  production: false,
  API: `https://asiservice.${ASICENTRAL_DOMAIN}/babou/api/esp`,
  auth: {
    Url: `https://api.${ASICENTRAL_DOMAIN}/login`,
    TokenPath: '/oauth2/token',
    StorageStrategy: 'localStorage',
    AuthorizationHeader:
      'Basic NDM5MDpmZmQ5MzgxZjc2N2U0ZjI2Yjg5MTFhN2Q2NzFlOWZiOQ==',
    canIntercept: requestStartsWith([
      `https://asiservice.${ASICENTRAL_DOMAIN}`,
    ]),
  },
  contentful: {
    space: '64iaj3sce04d',
    accessToken: 'etxrW4dvOeWqyedaJmK5l32szyy2psQsGHJrG7bNYiI',
    environment: 'master',
    sponsoredContent: {
      type: 'sponsoredContent',
      space: 'fika9b2zervd',
      host: 'preview.contentful.com',
      accessToken: '-aKGymG0FAOk7I_aqZjGD1bxx1vD1IuHdIyk8scOuQk',
    },
  },
  ARDOR_API: `https://asiservice.${ASICENTRAL_DOMAIN}/babou/api/ardor`,
  ASISERVICE_API: `https://asiservice.${ASICENTRAL_DOMAIN}`,
  SMARTLINK_API: `https://api.${ASICENTRAL_DOMAIN}/v1`,
  VENUS_API: `https://asiservice.${ASICENTRAL_DOMAIN}/babou/api/venus`,
  VULCAN_API: `https://asiservice.${ASICENTRAL_DOMAIN}/babou/api/vulcan`,
  ZEAL_API: `https://asiservice.${ASICENTRAL_DOMAIN}/babou/api/zeal`,
  SIRIUS_API: `https://asiservice.${ASICENTRAL_DOMAIN}/babou/api/sirius`,

  WespAuthorizationHeader:
    'Basic MTc3OjRkOWZhZmJjYTBkZDdiYTFiMTdiZWJhZjUxZjM4MDVm',

  imports: [
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot({
      filter(action, state) {
        return false;
        const type = getActionTypeFromInstance(action);
        return configOverrides.stateLoggingFilter(action, type, state);
      },
      disabled: false,
    }),
    MetaModule.forRoot({
      applicationName: 'Encore',
      pageTitleSeparator: ' - ',
      defaults: {
        title: 'Encore',
      },
    }),
    AppCuesModule.forRoot({
      appId: '79984',
      enabled: false,
    }),
    HeapIoModule.forRoot({
      appId: '3258128001',
      enabled: false,
      options: {
        secureCookie: true,
        disableTextCapture: true,
      },
    }),
    HotJarModule.forRoot({
      appId: '2502586',
      enabled: false,
    }),
    RollbarModule.forRoot({
      accessToken: 'e5afad46022b42bcbe3aa014bfc34a60',
      captureUncaught: true,
      captureUnhandledRejections: true,
      environment: 'dev',
      enabled: false,
    }),
    LogRocketModule.forRoot({
      appId: 'fa0veu/encore',
      enabled: false,
    }),
    FeatureFlagsModule.forRoot(ExplicitFeatureFlagsService),
    ...importOverrides,
  ],
  providers: [
    ExplicitFeatureFlagsService.provideWithConfig({
      directory: true,
      orders: true,
      presentations: true,
      projects: true,
      websites: true,
    }),
  ],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
