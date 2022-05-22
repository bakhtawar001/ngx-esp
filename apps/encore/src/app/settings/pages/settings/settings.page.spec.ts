import { APP_BASE_HREF } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthFacade } from '@esp/auth';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { SettingsPage, SettingsPageModule } from './settings.page';

describe('SettingsPage', () => {
  const createComponent = createComponentFactory({
    component: SettingsPage,
    imports: [NgxsModule.forRoot(), RouterTestingModule, SettingsPageModule],
    providers: [
      {
        provide: APP_BASE_HREF,
        useValue: '',
      },
      mockProvider(AuthFacade, {
        user: {},
      }),
    ],
  });

  const testSetup = () => {
    const spectator = createComponent({ detectChanges: false });
    const component = spectator.component;
    return { component, spectator };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it('should display the setting menu correctly', () => {
    // Arrange
    const { spectator } = testSetup();
    const settingsMenu = spectator.query('.settings-menu > cos-vertical-menu');

    // Assert
    expect(settingsMenu).toExist();
  });

  it('should display appropriate settings content correctly', () => {
    // Arrange
    const { spectator } = testSetup();
    const settingsContent = spectator.query('.settings-content > cos-card');

    // Assert
    expect(settingsContent).toExist();
    expect(settingsContent.children).not.toBe(null);
  });
});
