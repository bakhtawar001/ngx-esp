import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ImageUrlService } from './image-url.service';

describe('UniqueIdService', () => {
  let service;

  let spectator: SpectatorService<ImageUrlService>;
  const createService = createServiceFactory({
    service: ImageUrlService,
    providers: [],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should generate a URL for a DOM element', () => {
    let url;
    const images = [
      'media/39191276',
      'media/39191277',
      'media/39191278',
      'media/39191279',
    ];
    for (let index = 0; index < images.length; index++) {
      url = service.getImageUrl(
        images[index],
        'https://api.uat-asicentral.com/v1'
      );
      expect(url).toBe(
        `https://api.uat-asicentral.com/v1/${images[index]}?size=large`
      );
    }
  });
});
