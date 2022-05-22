import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { CompaniesService } from './companies.service';

describe('CompaniesService', () => {
  let spectator: SpectatorService<CompaniesService>;
  const createService = createServiceFactory({
    service: CompaniesService,
    imports: [HttpClientTestingModule],
    entryComponents: [],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should exist', () => {
    expect(spectator.service).toBeTruthy();
  });
});
