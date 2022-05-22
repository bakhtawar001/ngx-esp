import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { OptInPreloadStrategy } from './opt-in-preload-strategy.service';

describe('OptInPreloadStrategy', () => {
  let spectator: SpectatorService<OptInPreloadStrategy>;
  const createService = createServiceFactory(OptInPreloadStrategy);

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });
});
