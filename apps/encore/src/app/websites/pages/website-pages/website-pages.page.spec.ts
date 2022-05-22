import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { WebsitePagesPage, WebsitePagesPageModule } from './website-pages.page';

describe('WebsitePagesPage', () => {
  let spectator: Spectator<WebsitePagesPage>;
  let component: WebsitePagesPage;

  const createComponent = createComponentFactory({
    component: WebsitePagesPage,
    imports: [
      WebsitePagesPageModule,
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
