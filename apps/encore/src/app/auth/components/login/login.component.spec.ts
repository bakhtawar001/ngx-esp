import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef } from '@angular/core';
import { inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Auth, AuthServiceConfig, AUTH_SERVICE_CONFIG } from '@asi/auth';
import { EspAuthModule } from '@esp/auth';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule, Store } from '@ngxs/store';
import { LoginComponent, LoginComponentModule } from './login.component';

describe('LoginComponent', () => {
  let spectator: Spectator<LoginComponent>;

  const createComponent = createComponentFactory({
    component: LoginComponent,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      NgxsModule.forRoot(),
      EspAuthModule.forRoot(),
      LoginComponentModule,
    ],
    providers: [
      mockProvider(AuthServiceConfig),
      mockProvider(ChangeDetectorRef),
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

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  it("should display the text as 'Keep me logged in' as checkbox label", () => {
    const keepLoggedInCheckboxLabel = spectator
      .query('cos-checkbox')
      .querySelector('.cos-checkbox-label');

    expect(keepLoggedInCheckboxLabel).toBeVisible();
    expect(keepLoggedInCheckboxLabel).toHaveText('Keep me logged in');
  });

  describe('LoginWithCredentials', () => {
    it('calls loginWithCredentials on authFacade', inject(
      [Store],
      (store: Store) => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');

        spectator.component.loginForm.controls.username.setValue('test');
        spectator.component.loginForm.controls.password.setValue('test');
        spectator.component.loginWithCredentials();

        expect(dispatchSpy).toHaveBeenCalledWith(
          new Auth.LoginWithCredentials(spectator.component.loginForm.value)
        );
      }
    ));

    it('calls loginWithCredentials after updating credentails when invalid', inject(
      [Store],
      (store: Store) => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        spectator.component.loginForm.controls.username.setValue('test');
        spectator.component.loginForm.controls.password.setValue('invalid');
        spectator.component.loginForm.controls.password.setErrors({
          serverError: 'invalid credentials',
        });
        spectator.component.loginForm.controls.password.setValue('valid');
        spectator.component.loginWithCredentials();

        expect(dispatchSpy).toHaveBeenCalledWith(
          new Auth.LoginWithCredentials(spectator.component.loginForm.value)
        );
      }
    ));
  });
});
