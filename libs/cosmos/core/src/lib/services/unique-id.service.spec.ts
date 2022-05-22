import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { UniqueIdService } from './unique-id.service';

describe('UniqueIdService', () => {
  let spectator: SpectatorService<UniqueIdService>;
  const createService = createServiceFactory(UniqueIdService);
  beforeEach(() => {
    spectator = createService();
  });

  it('should generate a unique ID for a DOM element', () => {
    const iterations = 100;
    const uniqueIds = [];
    let id;
    for (let index = 0; index < iterations; index++) {
      id = spectator.service.getUniqueIdForDom('cos');
      expect(uniqueIds.indexOf(id)).toBe(-1);
      uniqueIds.push(id);
    }
  });
});
