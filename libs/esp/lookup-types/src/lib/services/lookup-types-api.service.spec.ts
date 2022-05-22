import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { LookupTypes, LookupTypesApiService } from './lookup-types-api.service';

describe('LookupTypesService', () => {
  let service: LookupTypesApiService;
  let http: HttpTestingController;
  let spectator: SpectatorService<LookupTypesApiService>;
  const createService = createServiceFactory({
    service: LookupTypesApiService,
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    http = spectator.inject<HttpTestingController>(HttpTestingController);
  });

  it('creates a service', () => {
    expect(service).toBeTruthy();
  });

  it('gets tag types', (done) => {
    service.getTagTypes().subscribe((res) => {
      expect(res).toBeTruthy();

      done();
    });

    const req = http.expectOne(`${service.uri}/${LookupTypes.TagTypes}`);

    expect(req.request.method).toBe('GET');

    req.flush({});

    http.verify();
  });

  it('gets link relationships', (done) => {
    service.getLinkRelationships().subscribe((res) => {
      expect(res).toBeTruthy();

      done();
    });

    const req = http.expectOne(
      `${service.uri}/${LookupTypes.LinkRelationships}`
    );

    expect(req.request.method).toBe('GET');

    req.flush({});

    http.verify();
  });

  it('gets notification templates', (done) => {
    service.getNotificationTemplateTypes().subscribe((res) => {
      expect(res).toBeTruthy();

      done();
    });

    const req = http.expectOne(
      `${service.uri}/${LookupTypes.NotificationTemplate}`
    );

    expect(req.request.method).toBe('GET');

    req.flush({});

    http.verify();
  });
});
