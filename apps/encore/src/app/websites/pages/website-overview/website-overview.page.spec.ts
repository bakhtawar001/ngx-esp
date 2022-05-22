import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  WebsiteOverviewPage,
  WebsiteOverviewPageModule,
} from './website-overview.page';

describe('WebsiteOverviewPage', () => {
  let spectator: Spectator<WebsiteOverviewPage>;
  let component: WebsiteOverviewPage;

  const createComponent = createComponentFactory({
    component: WebsiteOverviewPage,
    imports: [
      WebsiteOverviewPageModule,
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
