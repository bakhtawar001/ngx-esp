import { APP_BASE_HREF } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AuthServiceConfig,
  AuthTokenService,
  AUTH_SERVICE_CONFIG,
} from '@asi/auth';
import { TrustHtmlPipeModule } from '@cosmos/common';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosInputModule } from '@cosmos/components/input';
import { AuthFacade, EspAuthModule } from '@esp/auth';
import {
  byText,
  createComponentFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { LoginService } from '@smartlink/auth';
import { of } from 'rxjs';
import { LicenseAgreementPage } from './license-agreement.page';

const MockLoginService = {
  getLicenseAgreement: () => of(new HttpResponse({ status: 200 })),
  login: () => of(new HttpResponse({ status: 200 })),
};

describe('LicenseAgreementPage', () => {
  const createComponent = createComponentFactory({
    component: LicenseAgreementPage,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      NgxsModule.forRoot(),
      EspAuthModule.forRoot(),
      CosInputModule,
      CosCheckboxModule,
      ReactiveFormsModule,
      CosButtonModule,
      TrustHtmlPipeModule,
    ],
    providers: [
      mockProvider(AuthServiceConfig),
      mockProvider(AuthTokenService),
      mockProvider(AuthFacade, {
        user: {
          GivenName: 'test',
          FamilyName: 'testing',
          email: 'test@testing.com',
        },
      }),
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

  const testSetup = () => {
    const spectator = createComponent();
    spectator.detectComponentChanges();

    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  describe('Validation', () => {
    it('accept button should be disabled when invalid', fakeAsync(() => {
      const { spectator, component } = testSetup();
      const acceptButton = spectator.query(byText('Accept'));
      component.form.controls.termsAccepted.setValue(false);
      component.form.controls.privacyPolicyAccepted.setValue(true);
      component.form.controls.signature.setValue('test');

      spectator.tick();
      expect(acceptButton).toBeDisabled();
    }));

    it('accept button should not be disabled when valid', fakeAsync(() => {
      const { spectator, component } = testSetup();
      const acceptButton = spectator.query(byText('Accept'));
      component.form.controls.termsAccepted.setValue(true);
      component.form.controls.privacyPolicyAccepted.setValue(true);
      component.form.controls.signature.setValue('test');

      spectator.tick();
      expect(acceptButton).not.toBeDisabled();
    }));
  });
});
