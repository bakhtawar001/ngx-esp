import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { SmartlinkAuthInterceptor } from './smartlink-auth.interceptor';
import { AUTH_SERVICE_CONFIG } from '@asi/auth';

describe('SmartlinkAuthInterceptor', () => {
  let interceptor;
  let spectator: SpectatorService<SmartlinkAuthInterceptor>;

  const snapshotResult = 'test';
  const selectSnapshotSpy = jest.fn().mockReturnValue(snapshotResult);
  const dispatchSpy = jest.fn();
  const createService = createServiceFactory({
    service: SmartlinkAuthInterceptor,
    imports: [HttpClientTestingModule, NgxsModule.forRoot()],
    providers: [
      SmartlinkAuthInterceptor,
      {
        provide: AUTH_SERVICE_CONFIG,
        useValue: {},
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    interceptor = spectator.service;
  });

  it('should create an instance', () => {
    expect(interceptor).toBeTruthy();
  });
});
