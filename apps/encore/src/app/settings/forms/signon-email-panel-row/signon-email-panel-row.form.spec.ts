import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AsiAuthModule, AsiAuthService } from '@asi/auth';
import { CosToastService } from '@cosmos/components/notification';
import { EspUserService, User } from '@esp/auth';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule, Store } from '@ngxs/store';
import { from } from 'rxjs';
import { ProfilePageLocalState } from '../../local-state';
import {
  SignonEmailPanelRowForm,
  SignonEmailPanelRowFormModule,
} from './signon-email-panel-row.form';

describe('SignonEmailPanelRowForm', () => {
  const createComponent = createComponentFactory({
    component: SignonEmailPanelRowForm,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      AsiAuthModule.forRoot(),
      SignonEmailPanelRowFormModule,
    ],
    providers: [
      mockProvider(AsiAuthService),
      mockProvider(EspUserService),
      mockProvider(CosToastService),
    ],
    detectChanges: false,
  });

  function setupTest() {
    const fakeUser: User = {
      Id: 1,
      LoginEmail: 'email@email.com',
    } as User;

    const fakeLocalState: Partial<ProfilePageLocalState> = {
      connect: () =>
        from(Promise.resolve(fakeLocalState as ProfilePageLocalState)),
      user: fakeUser,
    };

    const spectator = createComponent({
      providers: [mockProvider(ProfilePageLocalState, fakeLocalState)],
    });
    const component = spectator.component;

    const store = spectator.inject(Store);

    spectator.detectChanges();

    return {
      spectator,
      component,
      store,
    };
  }

  it('should create', () => {
    const { component } = setupTest();
    expect(component).toBeTruthy();
  });

  it('should display login email section', () => {
    const { spectator } = setupTest();
    const heading = spectator.query(
      '.settings-main-content > .form-row-title > strong'
    );
    expect(heading.textContent).toMatch('Log-In Email');
  });

  describe('View', () => {
    it('should display login email address and edit button', () => {
      const { spectator } = setupTest();
      const valueField = spectator.query(
        'asi-panel-editable-row-inactive > p.form-row-value'
      );
      expect(valueField).toHaveText('email@email.com');
      // expect(editButton).toHaveText('Edit');
    });
  });

  // describe('Edit', () => {
  //   let control: AbstractControl;

  //   beforeEach(() => {
  //     spectator.click(editButton);
  //     control = component.infoForm.get('loginEmail');
  //   });

  //   it('should be invalid if more than 100 characters are entered', () => {
  //     const longEmail =
  //       'emailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemail@emial.com'; // 105 chars

  //     control.markAsDirty();
  //     control.setValue(longEmail);

  //     spectator.detectChanges();

  //     const saveButton: HTMLButtonElement = getSaveBtn(panel);

  //     expect(saveButton).toHaveAttribute('disabled');
  //     expect(control.valid).toBeFalsy();
  //     expect(control.errors.maxlength).toBeTruthy();
  //   });

  //   it('should have active save button after valid email entered', () => {
  //     const validEmail = 'em@il.com';

  //     control.markAsDirty();
  //     control.setValue(validEmail);

  //     spectator.detectChanges();

  //     const saveButton: HTMLButtonElement = getSaveBtn(panel);

  //     expect(saveButton).not.toHaveAttribute('disabled');
  //   });

  //   it('should call save action when input is valid and clicked', () => {
  //     const authfacade = spectator.inject(AuthFacade, true);
  //     const authFacadeSpy = spyOn(
  //       authfacade,
  //       'updateLoginEmail'
  //     ).and.returnValue(of(true));

  //     const validEmail = 'em@il.com';

  //     control.markAsDirty();
  //     control.setValue(validEmail);

  //     spectator.detectChanges();

  //     const saveButton: HTMLButtonElement = getSaveBtn(panel);

  //     spectator.click(saveButton);

  //     expect(authFacadeSpy).toHaveBeenCalledWith(validEmail);
  //   });

  //   it('should show error when email address is empty', () => {
  //     control.setValue('');

  //     expect(control.errors.required).toBeTruthy();
  //   });

  //   it('should show error when email address is invalid', () => {
  //     control.setValue('emailatemial.com');

  //     expect(control.errors.valid).toBeFalsy();
  //   });
  // });
});
