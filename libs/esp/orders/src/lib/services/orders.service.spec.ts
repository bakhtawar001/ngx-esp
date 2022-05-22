import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductLineItem } from '@esp/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { catchError } from 'rxjs/operators';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let fixture;
  let service;
  let http;
  let spectator: SpectatorService<OrdersService>;
  const createService = createServiceFactory({
    service: OrdersService,
    imports: [HttpClientTestingModule],
    providers: [OrdersService],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    http = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('tasks', () => {
    it('should call tasks endpoint', () => {
      service.tasks(1).subscribe();

      const res = http.expectOne(`${service.uri}/1/tasks`);

      res.flush([]);

      expect(res.request.method).toBe('GET');

      http.verify();
    });

    it('should call handleError on error server response', () => {
      service
        .tasks(1)
        .pipe(
          catchError((e) => {
            expect(e).toBeTruthy();

            return e;
          })
        )
        .subscribe();

      const res = http.expectOne(`${service.uri}/1/tasks`);

      res.flush([], { status: 500, statusText: 'Error' });

      expect(res.request.method).toBe('GET');

      http.verify();
    });
  });

  describe('updateLineItem', () => {
    it('passes updateTaxes', (done) => {
      const orderId = 1;
      const lineItem = {} as ProductLineItem;

      lineItem.Id = 1234;

      const updateTaxesParam = 'test';

      service
        .updateLineItem(orderId, lineItem, updateTaxesParam)
        .subscribe(() => {
          done();
        });

      const res = http.expectOne(
        `${service.uri}/${orderId}/lineitems/${lineItem.Id}?updateTaxes=${updateTaxesParam}`
      );

      res.flush({});

      http.verify();
    });

    it('uses default taxes param', (done) => {
      const orderId = 1;
      const lineItem = {} as ProductLineItem;

      lineItem.Id = 1234;

      service.updateLineItem(orderId, lineItem).subscribe(() => {
        done();
      });

      const res = http.expectOne(
        `${service.uri}/${orderId}/lineitems/${lineItem.Id}?updateTaxes=none`
      );

      res.flush({});

      http.verify();
    });
  });

  describe('deleteLineItem', () => {
    it('deletes line item', (done) => {
      const orderId = 1;
      const lineItemId = 12345;

      service.deleteLineItem(orderId, lineItemId).subscribe(() => {
        done();
      });

      const res = http.expectOne(
        `${service.uri}/${orderId}/lineitems/${lineItemId}`
      );

      res.flush({});

      http.verify();
    });
  });
});
