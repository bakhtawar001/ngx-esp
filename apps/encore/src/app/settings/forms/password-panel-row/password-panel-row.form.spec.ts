import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { CosToastService } from '@cosmos/components/notification';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { LoginService } from '@smartlink/auth';
import { of } from 'rxjs';
import {
  PasswordPanelRowForm,
  PasswordPanelRowFormModule,
} from './password-panel-row.form';

const MockLoginService = {
  resetPassword: (oldPassword: string, newPassword: string) =>
    of(new HttpResponse({ status: 200 })),
};
describe('PasswordPanelRowForm', () => {
  let spectator: Spectator<PasswordPanelRowForm>;
  let component: PasswordPanelRowForm;

  const createComponent = createComponentFactory({
    component: PasswordPanelRowForm,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      PasswordPanelRowFormModule,
    ],
    providers: [
      mockProvider(CosToastService),
      mockProvider(LoginService, MockLoginService),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show password help message', () => {
    const msg = `It's a good idea to use a strong password that you are not using elsewhere.`;
    const helpMessage = spectator.query('.form-row-value');
    expect(helpMessage.textContent).toMatch(msg);
  });

  it('should call service and show success toast when successful', () => {
    component.form = new FormGroup({
      password: new FormGroup({
        existingPassword: new FormControl('existingpass'),
        newPassword: new FormControl('newpass'),
      }),
    });

    const loginService = spectator.inject(LoginService, true);
    const loginServiceSpy = jest
      .spyOn(loginService, 'resetPassword')
      .mockReturnValue(of(new HttpResponse({ status: 200 })));

    component.save();

    expect(loginServiceSpy).toHaveBeenCalledWith({
      applicationName: 'Encore',
      oldPassword: 'existingpass',
      newPassword: 'newpass',
      templateCode: 'ERPC',
    });
  });
});
