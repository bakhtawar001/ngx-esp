import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthServiceConfig, AUTH_SERVICE_CONFIG } from '@asi/auth';
import { EspAuthModule } from '@esp/auth';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { LoginService } from '@smartlink/auth';
import { LoginPage, LoginPageModule } from './login.page';

const MockLoginService = {};

describe('LoginPage', () => {
  let spectator: Spectator<LoginPage>;
  let component: LoginPage;

  const createComponent = createComponentFactory({
    component: LoginPage,
    imports: [
      RouterTestingModule,
      NgxsModule.forRoot(),
      LoginPageModule,
      HttpClientTestingModule,
      RouterTestingModule,
      NgxsModule.forRoot(),
      EspAuthModule.forRoot(),
    ],
    providers: [
      mockProvider(AuthServiceConfig),
      mockProvider(ChangeDetectorRef),
      mockProvider(LoginService, MockLoginService),
      {
        provide: APP_BASE_HREF,
        useValue: '',
      },
      {
        provide: AUTH_SERVICE_CONFIG,
        useValue: {
          Url: '',
          TokenPath: '',
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
