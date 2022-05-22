import { TestBed } from '@angular/core/testing';
import { CosDialogModule } from '@cosmos/components/dialog';
import { OrderDialogService } from './order-dialog.service';

describe('OrderDialogService', () => {
  let service: OrderDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CosDialogModule],
    });
    service = TestBed.inject(OrderDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
