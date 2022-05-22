import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ClipboardService } from './clipboard.service';

describe('ClipboardService', () => {
  let http;
  let service;
  let spectator: SpectatorService<ClipboardService>;
  const createService = createServiceFactory({
    service: ClipboardService,
    imports: [HttpClientTestingModule],
    providers: [ClipboardService],
  });

  beforeEach(() => {
    spectator = createService();

    http = spectator.inject(HttpTestingController);
    service = spectator.service;
  });

  it('works', () => {
    expect(service).toBeTruthy();
  });

  describe('create', () => {
    it('posts form', () => {
      service
        .create({
          Product: { Id: 1 },
          ImageUrl: 'test',
        })
        .subscribe();

      const res = http.expectOne(service.uri);

      res.flush({});

      expect(res.request.method).toBe('POST');
    });
  });

  describe('deleteList', () => {
    it('DELETEs with params', () => {
      const value = [1, 2];

      service.deleteList(value).subscribe();

      const res = http.expectOne(`${service.uri}?ids=${value.join(',')}`);

      res.flush({});

      expect(res.request.method).toBe('DELETE');
    });
  });
});
