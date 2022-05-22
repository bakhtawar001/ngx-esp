import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service;
  let http;

  let spectator: SpectatorService<ProductsService>;
  const createService = createServiceFactory({
    service: ProductsService,
    imports: [HttpClientTestingModule],
    providers: [],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    http = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should call getProductOfTheDay', () => {
  //   service.getProductOfTheDay().subscribe();

  //   const res = http.expectOne(`${service.uri}/daily`);

  //   res.flush([]);

  //   expect(res.request.method).toBe('GET');

  //   http.verify();
  // });

  it('should call getProductMatrix', () => {
    service.getProductMatrix(1).subscribe();

    const res = http.expectOne(`${service.uri}/${1}/matrix`);

    res.flush([]);

    expect(res.request.method).toBe('GET');

    http.verify();
  });

  it('should call getProductMedia with params', () => {
    const params = { p: 'param' };
    service.getProductMedia(1, params).subscribe();

    const res = http.expectOne(`${service.uri}/${1}/media?p=param`);

    res.flush([]);

    expect(res.request.method).toBe('GET');

    http.verify();
  });
});
