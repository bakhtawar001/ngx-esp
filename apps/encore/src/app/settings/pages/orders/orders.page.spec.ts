import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuillModule } from 'ngx-quill';
import { OrdersPage } from './orders.page';

describe('OrdersPage', () => {
  let component: OrdersPage;
  let fixture: ComponentFixture<OrdersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuillModule.forRoot(), OrdersPage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
