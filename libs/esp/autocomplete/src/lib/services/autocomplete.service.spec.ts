import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { AutocompleteService } from './autocomplete.service';

describe('AutocompleteService', () => {
  let spectator: SpectatorService<AutocompleteService>;
  let service: AutocompleteService;
  let http: HttpTestingController;
  const createService = createServiceFactory({
    service: AutocompleteService,
    imports: [HttpClientTestingModule],
    providers: [AutocompleteService],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    http = spectator.inject(HttpTestingController);
  });

  it('creates a service', () => {
    expect(service).toBeTruthy();
  });

  it('GETs parties', () => {
    service.parties({ term: '' }).toPromise();

    const req = http.expectOne(`${service.uri}/parties?term=`);

    expect(req.request.method).toEqual('GET');

    req.flush({});

    http.verify();
  });

  it('GETs users', () => {
    service.users({ term: '' }).toPromise();

    const req = http.expectOne(`${service.uri}/users?term=`);

    expect(req.request.method).toEqual('GET');

    req.flush({});

    http.verify();
  });

  it('GETs usersandteams', () => {
    service.usersAndTeams({ term: '' }).toPromise();

    const req = http.expectOne(`${service.uri}/usersandteams?term=`);

    expect(req.request.method).toEqual('GET');

    req.flush({});

    http.verify();
  });

  it('Transforms criteria to query params', () => {
    service
      .usersAndTeams({ term: 'test', filters: { Ids: [1, 2, 3] as any } })
      .toPromise();

    const req = http.expectOne(
      `${service.uri}/usersandteams?term=test&filters=%7B%22Ids%22:%5B1,2,3%5D%7D`
    );

    expect(req.request.method).toEqual('GET');

    req.flush({});

    http.verify();
  });

  it('ignores criteria keys w undefined value', () => {
    service.usersAndTeams({ term: 'test', filters: undefined }).toPromise();

    const req = http.expectOne(`${service.uri}/usersandteams?term=test`);

    expect(req.request.method).toEqual('GET');

    req.flush({});

    http.verify();
  });

  it('stringifies object filters', () => {
    const filters = { test: 1 };
    const params = { filters } as any;

    service.usersAndTeams(params).toPromise();

    const value = encodeURI(JSON.stringify(filters));

    const req = http.expectOne(`${service.uri}/usersandteams?filters=${value}`);

    expect(req.request.method).toEqual('GET');

    req.flush({});

    http.verify();
  });
});
