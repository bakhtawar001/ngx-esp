import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { inject } from '@angular/core/testing';
import { MockAuthServiceConfig } from '@asi/auth/mocks';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { AUTH_SERVICE_CONFIG } from '../types';
import { AsiAuthService } from './auth.service';

const mockLoginCredentials = {
  asi_number: 'test',
  username: 'test',
  password: 'test',
  rememberMe: false,
};

describe('AuthService', () => {
  let http;
  let authService;
  let spectator: SpectatorService<AsiAuthService>;
  const createService = createServiceFactory({
    service: AsiAuthService,
    imports: [HttpClientTestingModule],
    providers: [
      {
        provide: AUTH_SERVICE_CONFIG,
        useValue: MockAuthServiceConfig,
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    http = spectator.inject(HttpTestingController);
    authService = spectator.inject(AsiAuthService);
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });
  describe('login', () => {
    it('posts credentials to config url', inject(
      [HttpTestingController],
      (httpController) => {
        authService.login(mockLoginCredentials).subscribe(() => {
          expect(req.request.method).toBe('POST');

          expect(req.request.body).toMatchObject({
            ...mockLoginCredentials,
            grant_type: 'password',
          });
        });

        const req = httpController.expectOne(
          `${MockAuthServiceConfig.Url}${MockAuthServiceConfig.TokenPath}`
        );

        req.flush({});

        httpController.verify();
      }
    ));

    it('posts custom grant_type', inject(
      [HttpTestingController],
      (httpController) => {
        authService.login(mockLoginCredentials, 'test').subscribe(() => {
          expect(res.request.method).toBe('POST');

          expect(res.request.body).toMatchObject({
            ...mockLoginCredentials,
            grant_type: 'test',
          });
        });

        const res = http.expectOne(
          `${MockAuthServiceConfig.Url}${MockAuthServiceConfig.TokenPath}`
        );

        res.flush({});
      }
    ));

    xit('calls handleError', (done) => {
      const errorResponse = {
        status: 500,
        statusText: 'Test Error',
      };

      const uri = `${MockAuthServiceConfig.Url}${MockAuthServiceConfig.TokenPath}`;

      const res = http.expectOne(uri);

      res.flush({}, errorResponse);

      authService
        .login(mockLoginCredentials)
        .toPromise()
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .then(() => { })
        .catch((e) => {
          expect(e).toEqual(
            `Http failure response for ${uri}: ${errorResponse.status} ${errorResponse.statusText}`
          );

          done();
        });
    });

    xit('returns AsiAuthStateAdapter if session is created', (done) => {
      const authState = {
        accessToken: 'token',
        displayName: 'test',
      };

      authService
        .login(mockLoginCredentials)
        .toPromise()
        .then((loginResponse: any) => {
          const { displayName } = loginResponse;

          expect({ displayName }).toMatchObject(authState);

          done();
        });

      const res = http.expectOne(
        `${MockAuthServiceConfig.Url}${MockAuthServiceConfig.TokenPath}`
      );

      res.flush({ access_token: authState.accessToken });

      const nextRes = http.expectOne(`${authService.espConfig.Url}/users/me`);

      nextRes.flush({ Name: authState.displayName });

      http.verify();
    });
  });

  describe('logout', () => {
    it('resolves', inject(
      [AsiAuthService, HttpTestingController],
      (service: AsiAuthService, http: HttpTestingController) => {
        service
          .logout()
          .toPromise()
          .then((res) => expect(res).toBe(true));
      }
    ));
  });
});
