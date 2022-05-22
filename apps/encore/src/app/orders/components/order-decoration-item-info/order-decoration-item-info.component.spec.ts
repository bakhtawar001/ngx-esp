import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDecorationItemInfoComponent } from './order-decoration-item-info.component';

describe('OrderDecorationItemInfoComponent', () => {
  let component: OrderDecorationItemInfoComponent;
  let fixture: ComponentFixture<OrderDecorationItemInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderDecorationItemInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDecorationItemInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
