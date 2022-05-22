import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderDecorationItemProductComponent } from './order-decoration-item-product.component';

describe('OrderDecorationProductComponent', () => {
  let component: OrderDecorationItemProductComponent;
  let fixture: ComponentFixture<OrderDecorationItemProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderDecorationItemProductComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDecorationItemProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
