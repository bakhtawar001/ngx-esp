import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import {
  CosNotificationModule,
  CosToastService,
} from '@cosmos/components/notification';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ApplicationCodes, LoginService, TemplateCodes } from '@smartlink/auth';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PasswordResetFormModule } from '../password-reset';

@UntilDestroy()
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-password-panel-row-form',
  templateUrl: './password-panel-row.form.html',
})
export class PasswordPanelRowForm {
  form = this._fb.group({});

  constructor(
    private _fb: FormBuilder,
    private _loginService: LoginService,
    private _toastService: CosToastService
  ) {}

  get save() {
    return this._save.bind(this);
  }

  private _save() {
    if (this.form.invalid) {
      return;
    }

    const password = this.form.get('password').value;
    return this._loginService
      .resetPassword({
        applicationName: ApplicationCodes.Encore,
        oldPassword: password.existingPassword,
        newPassword: password.newPassword,
        templateCode: TemplateCodes.ResetPasswordChange,
      })
      .pipe(
        map(() => {
          this._toastService.success(
            'Password updated',
            'Your password has been successfully updated'
          );

          this.form.reset();

          return true;
        }),
        catchError((err) => {
          const newPasswordControl = this.form.get('password.newPassword');
          const existingPasswordControl = this.form.get(
            'password.existingPassword'
          );

          if (err instanceof HttpErrorResponse) {
            if (err.status === 401 || err.status === 400) {
              // need this to show validation after
              existingPasswordControl.updateValueAndValidity();
              // Invalidate current password
              existingPasswordControl.setErrors({
                invalid: true,
              });
            }
          } else {
            // need this to show validation after
            newPasswordControl.updateValueAndValidity();
            newPasswordControl.setErrors({
              serverError: err,
            });
          }

          // need this for panel editable row update
          this.form.updateValueAndValidity();

          return throwError(err);
        }),
        untilDestroyed(this)
      );
  }
}

@NgModule({
  declarations: [PasswordPanelRowForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    CosNotificationModule,
    CosSegmentedPanelModule,

    AsiPanelEditableRowModule,
    PasswordResetFormModule,
  ],
  exports: [PasswordPanelRowForm],
})
export class PasswordPanelRowFormModule {}
