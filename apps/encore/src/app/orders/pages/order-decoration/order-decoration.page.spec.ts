import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { OrderDetailLocalState } from '../../local-states';
import {
  OrderDecorationPage,
  OrderDecorationPageModule,
} from './order-decoration.page';

describe('OrderDecorationPage', () => {
  let spectator: Spectator<OrderDecorationPage>;
  let component: OrderDecorationPage;

  const createComponent = createComponentFactory({
    component: OrderDecorationPage,
    imports: [OrderDecorationPageModule, NgxsModule.forRoot()],
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
