import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { SearchCriteria } from '@esp/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { RestClient } from './rest-client.service';

interface TestEntity {
  id: number;
}

@Injectable()
class MockRestClient extends RestClient<TestEntity> {
  override url = 'test';
  override pk = 'id';
}

describe('RestClient', () => {
  let spectator: SpectatorService<MockRestClient>;
  const createService = createServiceFactory({
    service: MockRestClient,
    imports: [HttpClientTestingModule],
    providers: [MockRestClient],
  });

  let service: MockRestClient;
  let http: HttpTestingController;

  beforeEach(() => {
    spectator = createService();

    service = spectator.service;
    http = spectator.inject<HttpTestingController>(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('query', () => {
    it('should call search endpoint with GET', () => {
      service.query<any>().toPromise();

      const req = http.expectOne(`${service.uri}/search?from=1&size=50`);

      expect(req.request.method).toEqual('GET');

      req.flush({});

      http.verify();
    });

    it('should stringify object keys', (done) => {
      const searchCriteria = new SearchCriteria({
        filters: {
          test: { terms: ['test'] },
        },
      });

      service.query<any>(searchCriteria).subscribe((res) => {
        expect(res).toBeTruthy();

        done();
      });

      const req = http.expectOne(
        `${service.uri}/search?from=1&size=50&filters=${encodeURI(
          JSON.stringify(searchCriteria.filters)
        )}`
      );

      expect(req.request.method).toEqual('GET');

      req.flush({});

      http.verify();
    });

    /*
        it('should catch error', inject([MockRestClient, HttpTestingController], (service, httpTestingController) => {
            service.query<any>().catch(e => expect(e).toBeTruthy());

            const req = httpTestingController.expectOne(`${service.uri}/search?from=1&size=50`);

            expect(req.request.method).toEqual('GET');

            req.flush({}, {status: 500, statusText: 'error'});

            httpTestingController.verify();
        }));
        */
  });

  describe('all', () => {
    it('should call uri with GET', () => {
      service.all().subscribe();

      const req = http.expectOne(service.uri);

      expect(req.request.method).toEqual('GET');

      req.flush({});

      http.verify();
    });

    it('should catch error', () => {
      service
        .all()
        .toPromise()
        .catch((e) => expect(e).toBeTruthy());

      const req = http.expectOne(`${service.uri}`);

      req.flush({}, { status: 500, statusText: 'error' });

      http.verify();
    });
  });

  describe('create', () => {
    it('should call uri with POST', () => {
      service.create({ id: 1 }).subscribe();

      const req = http.expectOne(service.uri);

      expect(req.request.method).toEqual('POST');

      req.flush({});

      http.verify();
    });
  });

  describe('delete', () => {
    it('should call uri with DELETE', () => {
      service.delete(1).subscribe();

      const req = http.expectOne(`${service.uri}/1`);

      expect(req.request.method).toEqual('DELETE');

      req.flush({});

      http.verify();
    });
  });

  describe('get', () => {
    it('should call uri with GET', () => {
      service.get(1).subscribe();

      const req = http.expectOne(`${service.uri}/1`);

      expect(req.request.method).toEqual('GET');

      req.flush({});

      http.verify();
    });
  });

  describe('save', () => {
    it('should call uri with POST', () => {
      service.save({ id: null }).subscribe();

      const req = http.expectOne(service.uri);

      expect(req.request.method).toEqual('POST');

      req.flush({});

      http.verify();
    });

    it('should call uri with PUT for existing entity', () => {
      service.save({ id: 1 }).subscribe();

      const req = http.expectOne(`${service.uri}/1`);

      expect(req.request.method).toEqual('PUT');

      req.flush({});

      http.verify();
    });
  });

  describe('update', () => {
    it('should call uri with PUT', () => {
      service.update({ id: 1 }).subscribe();

      const req = http.expectOne(`${service.uri}/1`);

      expect(req.request.method).toEqual('PUT');

      req.flush({});

      http.verify();
    });
  });
});
