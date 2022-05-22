import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { NotesService } from './notes.service';

describe('NotesService', () => {
  let spectator: SpectatorService<NotesService>;
  const createService = createServiceFactory({
    service: NotesService,
    providers: [NotesService],
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });
});
