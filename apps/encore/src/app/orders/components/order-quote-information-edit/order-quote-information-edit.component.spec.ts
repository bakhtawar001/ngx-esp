import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  OrderQuoteInformationEditComponent,
  OrderQuoteInformationEditComponentModule,
} from './order-quote-information-edit.component';

describe('OrderQuoteInformationEditComponent', () => {
  let spectator: Spectator<OrderQuoteInformationEditComponent>;
  let component: OrderQuoteInformationEditComponent;

  const createComponent = createComponentFactory({
    component: OrderQuoteInformationEditComponent,
    imports: [OrderQuoteInformationEditComponentModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
