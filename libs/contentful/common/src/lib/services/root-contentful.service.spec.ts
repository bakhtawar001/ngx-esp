import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ContentfulService } from './contentful.service';
import { RootContentfulService } from './root-contentful.service';

describe('RootContentfulService', () => {
  let spectator: SpectatorService<RootContentfulService>;
  const createService = createServiceFactory(RootContentfulService);

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator).toBeTruthy();
  });

  it('sets this.config & configures new contentful service', () => {
    const config = {
      space: 'test',
      accessToken: 'test',
      environment: 'test',
      host: 'test',
    };

    spectator.service.setGlobalConfig(config);

    const spy = jest.spyOn(ContentfulService.prototype, 'setConfig');

    spectator.service.getClient();

    expect(spy).toHaveBeenCalledWith(...Object.values(config));
  });
});
