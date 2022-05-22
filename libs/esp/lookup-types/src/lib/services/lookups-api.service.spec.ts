import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { LookupsApiService } from './lookups-api.service';

describe('LookupsApiService', () => {
  let spectator: SpectatorService<LookupsApiService>;
  const createService = createServiceFactory({
    service: LookupsApiService,
    imports: [HttpClientTestingModule],
  });

  function setup() {
    spectator = createService();
    const service = spectator.service;
    const http = spectator.inject<HttpTestingController>(HttpTestingController);
    return { service, http };
  }

  it('creates a service', () => {
    // Arrange & Act
    const { service } = setup();
    // Assert
    expect(service).toBeTruthy();
  });

  it('should get the lookups from the correct url', (done) => {
    // Arrange
    const { service, http } = setup();
    // Act
    service.getLookups().subscribe((res) => {
      // Final Assert
      expect(res).toBeTruthy();
      done();
    });
    // Assert
    const req = http.expectOne(`${service.uri}/lookups`);
    expect(req.request.method).toBe('GET');
    req.flush({});
    http.verify();
  });
});
