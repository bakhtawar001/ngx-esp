import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ContentfulService } from './contentful.service';

describe('ContentfulService', () => {
  let spectator: SpectatorService<ContentfulService>;
  const createService = createServiceFactory(ContentfulService);

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('getEntities', () => {});

  describe('getEntity', () => {});

  describe('setConfig', () => {});
});
