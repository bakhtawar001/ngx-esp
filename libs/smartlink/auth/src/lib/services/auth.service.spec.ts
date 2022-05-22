import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AUTH_SERVICE_CONFIG } from '@asi/auth';
import { MockAuthServiceConfig } from '@asi/auth/mocks';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { SmartlinkAuthService } from './auth.service';
import { PermissionService } from './permission.service';
import { mockProvider } from '@ngneat/spectator/jest';
import { Store } from '@ngxs/store';
import { EMPTY, of } from 'rxjs';

const mockLoginCredentials = {
  username: 'yatluri',
  password: 'Pavan990.',
  rememberMe: false,
};
describe('SmartlinkAuthService', () => {
  let service;
  let loginService;
  let http;
  let spectator: SpectatorService<SmartlinkAuthService>;
  const createService = createServiceFactory({
    service: SmartlinkAuthService,
    imports: [HttpClientTestingModule, RouterTestingModule],
    providers: [
      PermissionService,
      {
        provide: AUTH_SERVICE_CONFIG,
        useValue: MockAuthServiceConfig,
      },
      mockProvider(Store, {
        select: EMPTY,
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    http = spectator.inject(HttpTestingController);
    loginService = spectator.inject(SmartlinkAuthService);
  });
  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('login', () => {
    it('posts credentials to config url', inject(
      [HttpTestingController],
      (httpController) => {
        loginService.login(mockLoginCredentials).subscribe(() => {
          expect(req.request.method).toBe('POST');
          expect(req.request.body).toMatchObject({
            ...mockLoginCredentials,
          });
        });
        const req = httpController.expectOne(`${MockAuthServiceConfig.Url}`);
        req.flush({});
        httpController.verify();
      }
    ));
  });

  describe('logout', () => {
    it('resolves', inject(
      [SmartlinkAuthService, HttpTestingController],
      (service: SmartlinkAuthService, http: HttpTestingController) => {
        service
          .logout()
          .toPromise()
          .then((res) => expect(res).toBe(true));
      }
    ));
  });
});
