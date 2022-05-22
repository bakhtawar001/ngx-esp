import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPaymentInvoiceComponent } from './order-payment-invoice.component';

describe('OrderPaymentInvoiceComponent', () => {
  let component: OrderPaymentInvoiceComponent;
  let fixture: ComponentFixture<OrderPaymentInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderPaymentInvoiceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPaymentInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
