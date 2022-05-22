import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderActionsShippingComponent } from './order-actions-shipping.component';

describe('OrderActionsShippingComponent', () => {
  let component: OrderActionsShippingComponent;
  let fixture: ComponentFixture<OrderActionsShippingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderActionsShippingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderActionsShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
