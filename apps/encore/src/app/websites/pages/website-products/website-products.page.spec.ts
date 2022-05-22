import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  WebsiteProductsPage,
  WebsiteProductsPageModule,
} from './website-products.page';

describe('WebsiteProductsPage', () => {
  let spectator: Spectator<WebsiteProductsPage>;
  let component: WebsiteProductsPage;

  const createComponent = createComponentFactory({
    component: WebsiteProductsPage,
    imports: [
      WebsiteProductsPageModule,
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
