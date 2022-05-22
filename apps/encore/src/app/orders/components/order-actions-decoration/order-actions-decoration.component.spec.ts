import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CosDialogModule } from '@cosmos/components/dialog';
import { OrderActionsDecorationComponent } from './order-actions-decoration.component';

describe('OrderActionsDecorationComponent', () => {
  let component: OrderActionsDecorationComponent;
  let fixture: ComponentFixture<OrderActionsDecorationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderActionsDecorationComponent],
      imports: [CosDialogModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderActionsDecorationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
