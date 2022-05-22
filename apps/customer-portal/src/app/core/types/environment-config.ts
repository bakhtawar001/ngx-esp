import { AuthServiceConfig } from '@esp/auth';

export class EnvironmentConfig {
  auth? = new AuthServiceConfig();
  production? = true;
  API: string;
  ASISERVICE_API: string;
  SMARTLINK_API: string;
}
