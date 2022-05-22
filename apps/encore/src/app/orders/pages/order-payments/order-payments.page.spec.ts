import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { OrderDetailLocalState } from '../../local-states';
import {
  OrderPaymentsPage,
  OrderPaymentsPageModule,
} from './order-payments.page';

describe('OrderPaymentsPage', () => {
  let spectator: Spectator<OrderPaymentsPage>;
  let component: OrderPaymentsPage;

  const createComponent = createComponentFactory({
    component: OrderPaymentsPage,
    imports: [OrderPaymentsPageModule, NgxsModule.forRoot()],
    providers: [OrderDetailLocalState],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
