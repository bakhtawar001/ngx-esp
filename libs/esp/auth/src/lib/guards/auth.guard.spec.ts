import { HttpClientModule } from '@angular/common/http';
import { inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AUTH_SERVICE_CONFIG } from '@asi/auth';
import { MockAuthServiceConfig } from '@asi/auth/mocks';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { AuthFacadeMock } from '../../../__mocks__';
import { AuthFacade } from '../services';
import { User } from '../types';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard;
  let authFacade;

  let spectator: SpectatorService<AuthFacade>;
  const createService = createServiceFactory({
    service: AuthFacade,
    imports: [RouterTestingModule, NgxsModule.forRoot(), HttpClientModule],
    providers: [
      {
        provide: AUTH_SERVICE_CONFIG,
        useValue: MockAuthServiceConfig,
      },
      {
        provide: AuthFacade,
        useClass: AuthFacadeMock,
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    authGuard = spectator.inject(AuthGuard);
    authFacade = spectator.service;
  });

  it('should be created', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  describe('CanActivate', () => {
    it("should call logout if user doesn't exists", () => {
      const spy = jest.spyOn(<any>authFacade, 'logout');

      Object.defineProperty(authFacade, 'user', {
        get: () => null,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        set: () => {},
      });

      authGuard.canActivate(null).subscribe((val) => {
        expect(val).toBeFalsy();
        expect(spy).toHaveBeenCalled();
      });
    });

    it("shouldn't call logout if user exists", inject(
      [AuthGuard, AuthFacade],
      (guard: AuthGuard, facade: AuthFacadeMock) => {
        const spy = jest.spyOn(<any>facade, 'logout');

        Object.defineProperty(
          facade,
          'user',
          new User({
            Id: 0,
            Name: '',
            GravatarHash: '',
            Permissions: [],
          })
        );

        guard.canActivate(null).subscribe((val) => {
          expect(val).toBeTruthy();
          expect(spy).not.toHaveBeenCalled();
        });
      }
    ));
  });
});
