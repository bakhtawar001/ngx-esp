import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { OnDemandPreloadService } from './on-demand-preload.service';

describe('OnDemandPreloadService', () => {
  let spectator: SpectatorService<OnDemandPreloadService>;
  const createService = createServiceFactory(OnDemandPreloadService);

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });
});
