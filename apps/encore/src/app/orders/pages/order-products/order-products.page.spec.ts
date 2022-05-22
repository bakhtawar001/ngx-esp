import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { OrderDetailLocalState } from '../../local-states';
import {
  OrderProductsPage,
  OrderProductsPageModule,
} from './order-products.page';

describe('OrderProductsPage', () => {
  let spectator: Spectator<OrderProductsPage>;
  let component: OrderProductsPage;

  const createComponent = createComponentFactory({
    component: OrderProductsPage,
    imports: [OrderProductsPageModule, NgxsModule.forRoot()],
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
