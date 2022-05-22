import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ContactsService } from './contacts.service';

describe('ContactsService', () => {
  let spectator: SpectatorService<ContactsService>;
  const createService = createServiceFactory({
    service: ContactsService,
    imports: [HttpClientTestingModule],
    entryComponents: [],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });
});
