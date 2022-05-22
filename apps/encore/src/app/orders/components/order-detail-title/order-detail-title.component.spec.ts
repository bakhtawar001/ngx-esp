import { CommonModule } from '@angular/common';
import { fakeAsync } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { CosButtonModule } from '@cosmos/components/button';
import { OrdersMockDb } from '@esp/__mocks__/orders';
import { Spectator } from '@ngneat/spectator';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';
import { OrderDetailLocalState } from '../../local-states';
import { OrderDetailTitleComponent } from './order-detail-title.component';
import { OrderLinkPipeModule } from './order-link.pipe';

describe('OrderDetailTitleComponent', () => {
  let spectator: Spectator<OrderDetailTitleComponent>;
  let component: OrderDetailTitleComponent;

  const orders = OrdersMockDb.orders as any;

  const state: Partial<OrderDetailLocalState> = {
    sortedOrders: [...orders],
    orderViewModel: orders[0],
    connect() {
      return of(this);
    },
  };

  const createComponent = createComponentFactory({
    component: OrderDetailTitleComponent,
    imports: [
      CommonModule,
      RouterTestingModule,
      MatMenuModule,
      CosButtonModule,
      NgxsModule.forRoot(),
      OrderLinkPipeModule,
    ],
    providers: [mockProvider(OrderDetailLocalState, state)],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a select Order/Quote button', () => {
    const button = spectator.query('.order-detail__select-order');
    expect(button).toExist();
  });

  it('should show Icon, Order/Quote Type and Number in the dropdown list', fakeAsync(() => {
    const button = spectator.query('.order-detail__select-order');
    spectator.click(button);
    spectator.tick(10);

    const firstOption = spectator.queryAll('.mat-menu-content a')[0];
    expect(firstOption).toHaveDescendant('i.fa-file-invoice');
    expect(firstOption).toHaveText((text: string) => {
      const expectedText =
        `${orders[0].Type} #${orders[0].Number}`.toLowerCase();
      return text.toLowerCase().includes(expectedText);
    });
  }));

  it('should show selected order as blue and first one in the dropdown list', fakeAsync(() => {
    const button = spectator.query('.order-detail__select-order');
    spectator.click(button);
    spectator.tick(10);

    const firstOption = spectator.queryAll('.mat-menu-content a')[0];
    expect(firstOption).toHaveClass('cos-text--blue');
    expect(firstOption).toHaveText(component.state.orderViewModel.Number);
  }));
});
