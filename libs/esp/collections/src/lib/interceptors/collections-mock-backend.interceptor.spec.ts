import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { CollectionsMockBackendInterceptor } from './collections-mock-backend.interceptor';

describe('CollectionsMockBackendInterceptor', () => {
  let spectator: SpectatorService<CollectionsMockBackendInterceptor>;
  const createService = createServiceFactory({
    service: CollectionsMockBackendInterceptor,
    providers: [CollectionsMockBackendInterceptor],
  });
  let interceptor;

  beforeEach(() => {
    spectator = createService();
    interceptor = spectator.service;
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
