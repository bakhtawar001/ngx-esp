import { ProjectsApiService } from './projects-api.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SearchCriteria } from '@esp/projects';

describe('ProjectsApiService', () => {
  let http: HttpTestingController;
  let service: ProjectsApiService;

  let spectator: SpectatorService<ProjectsApiService>;
  const createService = createServiceFactory({
    service: ProjectsApiService,
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

  describe('search projects', () => {
    it('should call search endpoint', () => {
      service.query(new SearchCriteria()).subscribe();

      const res = http.expectOne(`${service.uri}/search`);

      res.flush([]);

      expect(res.request.body).toEqual({
        from: 1,
        size: 50,
      });
      expect(res.request.method).toBe('POST');

      http.verify();
    });
  });
});
