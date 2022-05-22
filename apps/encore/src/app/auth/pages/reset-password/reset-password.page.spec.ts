import { APP_BASE_HREF } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CosInputModule } from '@cosmos/components/input';
import { CosToastService } from '@cosmos/components/notification';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  AnonymousResetPassword,
  ApplicationCodes,
  LoginService,
  PermissionService,
  TemplateCodes,
} from '@smartlink/auth';
import { of } from 'rxjs';
import { ResetPasswordPage } from '.';
import { LogoComponentModule } from '../../../core/components/logo/encore-logo.component';
import { PasswordResetFormModule } from '../../../settings/forms/password-reset';
import { ResetPasswordPageModule } from './reset-password.page';

const MockLoginService = {
  resetPassword: (email: string, password: string, resetKey: string) =>
    of(new HttpResponse({ status: 200 })),
  validateResetKey: () => of(new HttpResponse({ status: 200 })),
};

describe('ForgotPasswordPage', () => {
  let spectator: Spectator<ResetPasswordPage>;

  const createComponent = createComponentFactory({
    component: ResetPasswordPage,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      NgxsModule.forRoot(),
      CosInputModule,
      PasswordResetFormModule,
      LogoComponentModule,
      ResetPasswordPageModule,
      RouterModule.forRoot([]),
    ],
    providers: [
      mockProvider(CosToastService),
      mockProvider(LoginService, MockLoginService),
      {
        provide: APP_BASE_HREF,
        useValue: '',
      },

      mockProvider(ActivatedRoute, {
        snapshot: {
          queryParams: {
            email: '',
            resetKey: '',
          },
        },
      }),

      mockProvider(PermissionService, {
        resetPassword: true,
      }),
    ],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  describe('ResetPassword', () => {
    it('should call resetPassword when input is valid and clicked', () => {
      const loginService = spectator.inject(LoginService, true);
      const loginServiceSpy = jest
        .spyOn(loginService, 'anonymousPasswordReset')
        .mockReturnValue(of(new HttpResponse({ status: 200 })));

      spectator.component.form.get('newPassword').setValue('password1');
      spectator.component.form
        .get('confirmPassword')
        .setValue(spectator.component.form.get('newPassword').value);
      spectator.component.email = 'test@test.com';
      spectator.component.resetKey = 'testkey';

      const sendButton: HTMLButtonElement =
        spectator.query('a.cos-flat-button');
      const anonymousParams: AnonymousResetPassword = {
        applicationName: ApplicationCodes.Encore,
        primaryEmail: spectator.component.email,
        password: spectator.component.form.get('newPassword').value,
        resetKey: spectator.component.resetKey,
        templateCode: TemplateCodes.ResetPasswordChange,
      };
      spectator.detectChanges();

      expect(sendButton).not.toHaveAttribute('disabled');

      spectator.click(sendButton);
      expect(loginServiceSpy).toHaveBeenCalledWith(anonymousParams);
    });
  });
});
