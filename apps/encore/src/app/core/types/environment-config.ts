import { ModuleWithProviders, Provider } from '@angular/core';
import { AuthServiceConfig } from '@asi/auth';

export interface EnvironmentConfig {
  auth: AuthServiceConfig;
  production: boolean;

  API: string;
  ARDOR_API?: string;
  ASISERVICE_API: string;
  SMARTLINK_API: string;
  VENUS_API?: string;
  VULCAN_API?: string;
  ZEAL_API?: string;
  SIRIUS_API?: string;

  providers?: Provider[];
  imports: ModuleWithProviders<unknown>[];

  WespAuthorizationHeader?: string;
  contentful?: {
    space: string;
    accessToken: string;
    environment: string;
    sponsoredContent?: {
      type: string;
      space: string;
      host: string;
      accessToken: string;
    };
  };
}
