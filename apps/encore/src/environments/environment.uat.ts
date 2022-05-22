import { requestStartsWith } from '@asi/auth';
import {
  AppCuesModule,
  AsiStatsModule,
  HeapIoModule,
  HotJarModule,
  LogRocketModule,
  RollbarModule,
  SegmentModule,
} from '@cosmos/analytics';
import {
  ExplicitFeatureFlagsService,
  FeatureFlagsModule,
} from '@cosmos/feature-flags';
import { EnvironmentConfig } from '../app/core/types';

const ASICENTRAL_DOMAIN = 'uat-asicentral.com';

export const environment: EnvironmentConfig = {
  production: true,
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
    AppCuesModule.forRoot({
      appId: '79984',
      enabled: true,
    }),
    HeapIoModule.forRoot({
      appId: '3258128001',
      enabled: true,
      options: {
        secureCookie: true,
        disableTextCapture: true,
      },
    }),
    HotJarModule.forRoot({
      appId: '2502586',
      enabled: true,
    }),
    RollbarModule.forRoot({
      accessToken: 'e5afad46022b42bcbe3aa014bfc34a60',
      captureUncaught: true,
      captureUnhandledRejections: true,
      environment: 'uat',
    }),
    LogRocketModule.forRoot({
      appId: 'fa0veu/encore',
      enabled: true,
    }),
    SegmentModule.forRoot({
      enabled: process.env.SEGMENT_ENABLED ?? true,
      apiKey: 'kqYPYj22MvJnIKvSPsQZf3ctPOYuRxGt',
    }),
    AsiStatsModule.forRoot({
      Url: `https://webhooks.${ASICENTRAL_DOMAIN}/segment`,
    }),
    FeatureFlagsModule.forRoot(ExplicitFeatureFlagsService),
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
