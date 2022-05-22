import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let service;
  let http;
  let spectator: SpectatorService<AccountService>;
  const createService = createServiceFactory({
    service: AccountService,
    imports: [HttpClientTestingModule],
    providers: [AccountService],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    http = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('accountConfigurationSettings', () => {
    it('calls endpoint', () => {
      service.accountConfigurationSettings().toPromise();

      const req = http.expectOne(`${service.uri}/configuration`);

      req.flush({});

      http.verify();
    });
  });

  describe('recentSearches', () => {
    it('calls endpoint', () => {
      service.recentSearches().toPromise();

      const req = http.expectOne(`${service.uri}/recent_searches`);

      req.flush({});

      http.verify();
    });
  });

  describe('accountInformation', () => {
    it('calls endpoint', () => {
      service.accountInformation().toPromise();

      const req = http.expectOne(`${service.uri}`);

      req.flush({});

      http.verify();
    });
  });

  describe('accountPreference', () => {
    it('calls endpoint', () => {
      service.accountPreference('test').toPromise();

      const req = http.expectOne(`${service.uri}/preferences/test`);

      req.flush({});

      http.verify();
    });
  });
});
