import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderActionsProductsComponent } from './order-actions-products.component';

describe('OrderActionsProductsComponent', () => {
  let component: OrderActionsProductsComponent;
  let fixture: ComponentFixture<OrderActionsProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderActionsProductsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderActionsProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
