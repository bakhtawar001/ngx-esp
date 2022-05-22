import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { RecentlyViewedState } from '../states';
import { RecentlyViewedFacade } from './recently-viewed.facade';

describe('RecentlyViewedFacade', () => {
  let facade;

  let spectator: SpectatorService<RecentlyViewedFacade>;
  const createService = createServiceFactory({
    service: RecentlyViewedFacade,
    imports: [HttpClientTestingModule, NgxsModule.forRoot()],
    providers: [RecentlyViewedFacade, RecentlyViewedState],
  });

  beforeEach(() => {
    spectator = createService();
    facade = spectator.service;
  });

  it('creates service', () => {
    expect(facade).toBeTruthy();
  });
});
