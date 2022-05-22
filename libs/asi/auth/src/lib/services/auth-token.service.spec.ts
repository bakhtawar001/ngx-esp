import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { AuthTokenService } from './auth-token.service';

describe('AuthTokenService', () => {
  let spectator: SpectatorService<AuthTokenService>;
  const createService = createServiceFactory(AuthTokenService);
  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });
});
