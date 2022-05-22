import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { SuppliersService } from './suppliers.service';

describe('SuppliersService', () => {
  let service;
  let http;

  let spectator: SpectatorService<SuppliersService>;
  const createService = createServiceFactory({
    service: SuppliersService,
    imports: [HttpClientTestingModule],
    providers: [],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    http = spectator.inject(HttpTestingController);
  });

  it('it should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getRatings with id', () => {
    const id = 1;
    service.getRatings(id).subscribe();

    const res = http.expectOne(`${service.uri}/${id}/ratings`);

    res.flush([]);

    expect(res.request.method).toBe('GET');

    http.verify();
  });

  it('should call getRatings with id and params', () => {
    const id = 1;
    const params = { p: 'param' };
    service.getRatings(id, params).subscribe();

    const res = http.expectOne(`${service.uri}/${id}/ratings?p=param`);

    res.flush([]);

    expect(res.request.method).toBe('GET');

    http.verify();
  });
});
