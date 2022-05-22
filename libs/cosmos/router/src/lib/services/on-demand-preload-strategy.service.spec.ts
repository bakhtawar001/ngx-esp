import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { OnDemandPreloadStrategy } from './on-demand-preload-strategy.service';

describe('OnDemandPreloadStrategy', () => {
  let spectator: SpectatorService<OnDemandPreloadStrategy>;
  const createService = createServiceFactory(OnDemandPreloadStrategy);

  beforeEach(() => {
    spectator = createService();
  });

  it('should create', () => {
    expect(spectator.service).toBeDefined();
  });
});
