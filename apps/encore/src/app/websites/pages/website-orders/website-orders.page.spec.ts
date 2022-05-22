import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  WebsiteOrdersPage,
  WebsiteOrdersPageModule,
} from './website-orders.page';

describe('WebsiteOrdersPage', () => {
  let spectator: Spectator<WebsiteOrdersPage>;
  let component: WebsiteOrdersPage;

  const createComponent = createComponentFactory({
    component: WebsiteOrdersPage,
    imports: [
      WebsiteOrdersPageModule,
      RouterTestingModule,
      NgxsModule.forRoot(),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
