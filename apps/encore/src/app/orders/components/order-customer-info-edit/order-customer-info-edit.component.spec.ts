import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  OrderCustomerInfoEditComponent,
  OrderCustomerInfoEditComponentModule,
} from './order-customer-info-edit.component';

describe('OrderCustomerInfoEditComponent', () => {
  let spectator: Spectator<OrderCustomerInfoEditComponent>;
  let component: OrderCustomerInfoEditComponent;

  const createComponent = createComponentFactory({
    component: OrderCustomerInfoEditComponent,
    imports: [OrderCustomerInfoEditComponentModule, NgxsModule.forRoot()],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
