import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ESP_SERVICE_CONFIG } from '@esp/service-configs';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { PartiesService } from './parties.service';

const serviceConfig = { Url: 'test' };
const serviceUri = 'test';
const id = 1;

class TestPartiesService extends PartiesService<any> {
  override url = serviceUri;
}

describe('PartiesService', () => {
  let service: TestPartiesService;
  let http: HttpTestingController;
  let spectator: SpectatorService<TestPartiesService>;
  const createService = createServiceFactory({
    service: TestPartiesService,
    imports: [HttpClientTestingModule],
    providers: [
      TestPartiesService,
      { provide: ESP_SERVICE_CONFIG, useValue: serviceConfig },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    http = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call links endpoint', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    service.links(id).subscribe(() => {});

    const res = http.expectOne(
      `${serviceConfig.Url}/${serviceUri}/${id}/links`
    );

    res.flush({});

    http.verify();
  });

  it('should call tasks endpoint', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    service.tasks(id).subscribe(() => {});

    const res = http.expectOne(
      `${serviceConfig.Url}/${serviceUri}/${id}/tasks`
    );

    res.flush({});

    http.verify();
  });

  it('should call notes endpoint', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    service.notes(id).subscribe(() => {});

    const res = http.expectOne(
      `${serviceConfig.Url}/${serviceUri}/${id}/notes`
    );

    res.flush({});

    http.verify();
  });

  it('should call emails endpoint', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    service.emails(id).subscribe(() => {});

    const res = http.expectOne(
      `${serviceConfig.Url}/${serviceUri}/${id}/emails`
    );

    res.flush({});

    http.verify();
  });

  it('should encode name value in "exists" endpoint', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    service.exists('testing #').subscribe(() => {});

    const res = http.expectOne(
      `${serviceConfig.Url}/${serviceUri}/exists/testing%20%23`
    );

    res.flush({});

    http.verify();
  });
});
