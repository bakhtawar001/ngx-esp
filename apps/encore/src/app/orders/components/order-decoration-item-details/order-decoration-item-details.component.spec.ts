import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDecorationItemDetailsComponent } from './order-decoration-item-details.component';

describe('OrderDecorationItemDetailsComponent', () => {
  let component: OrderDecorationItemDetailsComponent;
  let fixture: ComponentFixture<OrderDecorationItemDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderDecorationItemDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDecorationItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
