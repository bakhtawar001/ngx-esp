import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { NetworkAwarePreloadStrategy } from './network-aware-preload-strategy.service';

describe('NetworkAwarePreloadStrategy', () => {
  let spectator: SpectatorService<NetworkAwarePreloadStrategy>;
  const createService = createServiceFactory(NetworkAwarePreloadStrategy);
  beforeEach(() => {
    spectator = createService();
  });
  it('should create', () => {
    expect(spectator.service).toBeDefined();
  });
});
