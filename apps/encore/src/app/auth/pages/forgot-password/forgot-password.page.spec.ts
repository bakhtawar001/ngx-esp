import { APP_BASE_HREF } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AbstractControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AuthServiceConfig,
  AuthTokenService,
  AUTH_SERVICE_CONFIG,
} from '@asi/auth';
import { EspAuthModule } from '@esp/auth';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { LoginService } from '@smartlink/auth';
import { of } from 'rxjs';
import {
  ForgotPasswordPage,
  ForgotPasswordPageModule,
} from './forgot-password.page';

const MockLoginService = {
  sendResetEmail: () => of(new HttpResponse({ status: 200 })),
};

describe('ForgotPasswordPage', () => {
  let spectator: Spectator<ForgotPasswordPage>;

  const createComponent = createComponentFactory({
    component: ForgotPasswordPage,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      NgxsModule.forRoot(),
      EspAuthModule.forRoot(),
      ForgotPasswordPageModule,
    ],
    providers: [
      mockProvider(AuthServiceConfig),
      mockProvider(AuthTokenService),
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

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  describe('SendResetEmail', () => {
    it('email should not be empty', () => {
      const sendButton: HTMLButtonElement = spectator.query(
        'button.cos-flat-button'
      );
      const emailControl: AbstractControl =
        spectator.component.resetPasswordEmail;
      emailControl.setValue('');
      spectator.detectChanges();
      spectator.click(sendButton);
      expect(emailControl.hasError('required')).toBeTruthy();
    });

    it('email should be valid', () => {
      const sendButton: HTMLButtonElement = spectator.query(
        'button.cos-flat-button'
      );
      const emailControl: AbstractControl =
        spectator.component.resetPasswordEmail;
      emailControl.setValue('testing.com');
      spectator.detectChanges();
      spectator.click(sendButton);
      expect(emailControl.hasError('email')).toBeTruthy();

      emailControl.setValue('testing@testing.com');
      spectator.detectChanges();
      spectator.click(sendButton);
      expect(emailControl.valid).toBeTruthy();
    });

    it('should call sendResetEmail when input is valid and clicked', () => {
      const sendButton: HTMLButtonElement = spectator.query(
        'button.cos-flat-button'
      );
      const emailControl: AbstractControl =
        spectator.component.resetPasswordEmail;
      const loginService = spectator.inject(LoginService, true);
      const loginServiceSpy = jest
        .spyOn(loginService, 'sendResetEmail')
        .mockReturnValue(of(new HttpResponse({ status: 200 })));
      const validEmail = 'email@email.com';
      emailControl.markAsDirty();
      emailControl.setValue(validEmail);
      spectator.detectChanges();
      expect(sendButton).not.toHaveAttribute('disabled');
      spectator.click(sendButton);
      expect(loginServiceSpy).toHaveBeenCalledWith(validEmail);
      spectator.detectChanges();
      const goToLogin: HTMLAnchorElement = spectator.query('a.cos-flat-button');
      expect(goToLogin).toHaveExactText(' Go back to Log In ');
    });
  });
});
