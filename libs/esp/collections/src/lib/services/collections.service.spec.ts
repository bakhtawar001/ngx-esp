import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { CollectionsService } from './collections.service';

describe('CollectionsService', () => {
  let http;
  let service: CollectionsService;

  let spectator: SpectatorService<CollectionsService>;
  const createService = createServiceFactory({
    service: CollectionsService,
    entryComponents: [],
    imports: [HttpClientTestingModule],
  });
  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    http = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('add', () => {
    it('should call add endpoint', () => {
      service.addProducts(1, []).subscribe();

      const res = http.expectOne(`${service.uri}/1/products`);

      res.flush([]);

      expect(res.request.method).toBe('PUT');

      http.verify();
    });
  });
});
