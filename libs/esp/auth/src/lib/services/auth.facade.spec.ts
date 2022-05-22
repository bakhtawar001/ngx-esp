import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Auth, AUTH_SERVICE_CONFIG } from '@asi/auth';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { AuthFacade } from './auth.facade';

describe('AuthFacade', () => {
  const dispatchSpy = jest.fn();
  const snapshotResult = 'test';
  const selectSnapshotSpy = jest.fn().mockReturnValue(snapshotResult);
  let spectator: SpectatorService<AuthFacade>;
  let authFacade;
  const createService = createServiceFactory({
    imports: [HttpClientTestingModule],
    service: AuthFacade,
    providers: [
      AuthFacade,
      {
        provide: Store,
        useValue: {
          select: () => of(),
          dispatch: dispatchSpy,
          selectSnapshot: selectSnapshotSpy,
        },
      },
      {
        provide: AUTH_SERVICE_CONFIG,
        useValue: {},
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    authFacade = spectator.service;
  });

  it('should be created', () => {
    expect(authFacade).toBeTruthy();
  });

  describe('logout', () => {
    it('calls dispatch', () => {
      authFacade.logout();
      expect(dispatchSpy).toHaveBeenCalledWith(new Auth.Logout());
    });
  });
});
