import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponents } from 'ng-mocks';
import { OrderLineItemProductHeaderComponent } from '../order-line-item-product-header/order-line-item-product-header.component';
import { OrderLineItemServiceHeaderComponent } from '../order-line-item-service-header/order-line-item-service-header.component';
import { OrderLineItemVariantsListComponent } from '../order-line-item-variants-list/order-line-item-variants-list.component';
import {
  OrderLineItemComponent,
  OrderLineItemComponentModule,
} from './order-line-item.component';

const lineItem = {
  Id: 1,
};

describe('OrderLineItemComponent', () => {
  let spectator: Spectator<OrderLineItemComponent>;
  let component: OrderLineItemComponent;

  const createComponent = createComponentFactory({
    component: OrderLineItemComponent,
    declarations: [
      MockComponents(
        OrderLineItemProductHeaderComponent,
        OrderLineItemServiceHeaderComponent,
        OrderLineItemVariantsListComponent
      ),
    ],
    imports: [RouterModule.forRoot([]), OrderLineItemComponentModule],
    providers: [
      {
        provide: APP_BASE_HREF,
        useValue: '',
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      // props: {
      //   lineItem,
      // },
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
