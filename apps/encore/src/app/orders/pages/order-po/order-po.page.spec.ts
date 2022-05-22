import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { OrderDetailLocalState } from '../../local-states';
import { OrderPoPage, OrderPoPageModule } from './order-po.page';

describe('OrderPoPage', () => {
  let spectator: Spectator<OrderPoPage>;
  let component: OrderPoPage;

  const createComponent = createComponentFactory({
    component: OrderPoPage,
    imports: [OrderPoPageModule, NgxsModule.forRoot()],
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
