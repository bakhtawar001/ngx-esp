import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { OrderSearchPage, OrderSearchPageModule } from './order-search.page';

describe('OrderSearchPage', () => {
  let spectator: Spectator<OrderSearchPage>;
  let component: OrderSearchPage;

  const createComponent = createComponentFactory({
    component: OrderSearchPage,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      OrderSearchPageModule,
      NgxsModule.forRoot(),
    ],
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
