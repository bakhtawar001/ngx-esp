import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDecorationItemComponent } from './order-decoration-item.component';

describe('OrderDecorationItemComponent', () => {
  let component: OrderDecorationItemComponent;
  let fixture: ComponentFixture<OrderDecorationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderDecorationItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDecorationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
