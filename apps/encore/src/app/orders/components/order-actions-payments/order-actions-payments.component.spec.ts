import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderActionsPaymentsComponent } from './order-actions-payments.component';

describe('OrderActionsPaymentsComponent', () => {
  let component: OrderActionsPaymentsComponent;
  let fixture: ComponentFixture<OrderActionsPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderActionsPaymentsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderActionsPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
