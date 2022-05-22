import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  WebsiteSettingsPage,
  WebsiteSettingsPageModule,
} from './website-settings.page';

describe('WebsiteSettingsPage', () => {
  let spectator: Spectator<WebsiteSettingsPage>;
  let component: WebsiteSettingsPage;

  const createComponent = createComponentFactory({
    component: WebsiteSettingsPage,
    imports: [
      WebsiteSettingsPageModule,
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
