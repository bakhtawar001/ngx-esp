import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  OrderQuoteHeaderComponent,
  OrderQuoteHeaderComponentModule,
} from './order-quote-header.component';

describe('OrderQuoteHeaderComponent', () => {
  let spectator: Spectator<OrderQuoteHeaderComponent>;
  let component: OrderQuoteHeaderComponent;

  const createComponent = createComponentFactory({
    component: OrderQuoteHeaderComponent,
    imports: [OrderQuoteHeaderComponentModule, NgxsModule.forRoot()],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
