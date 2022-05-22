import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgModule,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { matchValues, passwordValidators } from '@cosmos/common';
import { CosButtonModule } from '@cosmos/components/button';
import { CosInputModule } from '@cosmos/components/input';
import { FormGroupComponent } from '@cosmos/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  ApplicationCodes,
  ErrorMessages,
  LoginService,
  PermissionService,
  TemplateCodes,
} from '@smartlink/auth';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LogoComponentModule } from '../../../core/components/logo/encore-logo.component';
import {
  PasswordResetFormModel,
  PasswordResetFormModule,
} from '../../../settings/forms/password-reset/password-reset.form';

type PasswordResetModel = Omit<PasswordResetFormModel, 'existingPassword'>;

@UntilDestroy()
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordPage
  extends FormGroupComponent<PasswordResetModel>
  implements OnInit
{
  email = '';
  resetKey = '';
  isUpdated = false;
  isValidLink = true;
  isLinkValidated = false;
  isProcessing = false;

  constructor(
    protected readonly route: ActivatedRoute,
    private loginService: LoginService,
    private permissionService: PermissionService,
    private _cdr: ChangeDetectorRef,
    private _router: Router
  ) {
    super();
    if (this.permissionService.resetPassword) {
      this.isLinkValidated = true;
    }
  }
  override ngOnInit() {
    super.ngOnInit();
    this.email = this.route.snapshot.queryParams['email'];
    this.resetKey = this.route.snapshot.queryParams['resetKey'];
    if (this.resetKey) {
      this.loginService
        .validateResetKey(this.resetKey)
        .pipe(
          catchError(() => {
            this.isValidLink = false;
            return EMPTY;
          }),
          untilDestroyed(this)
        )
        .subscribe()
        .add(() => {
          this.isLinkValidated = true;
          this._cdr.markForCheck();
        });
    }
  }

  updatePassword(): void {
    this.isProcessing = true;
    if (this.resetKey && this.resetKey.length) {
      this.loginService
        .anonymousPasswordReset({
          templateCode: TemplateCodes.ResetPasswordChange,
          primaryEmail: this.email,
          resetKey: this.resetKey,
          password: this.form.controls?.newPassword?.value,
          applicationName: ApplicationCodes.Encore,
        })
        .pipe(
          tap(() => {
            this.isUpdated = true;
            this._cdr.markForCheck();
          }),
          catchError(() => {
            this.isUpdated = false;
            this.setFormValidationError();
            return EMPTY;
          }),
          untilDestroyed(this)
        )
        .subscribe();
    } else {
      this.loginService
        .resetPassword({
          templateCode: TemplateCodes.ResetPasswordChange,
          newPassword: this.form.controls?.newPassword.value,
          applicationName: ApplicationCodes.Encore,
        })
        .pipe(
          tap(() => {
            this.isUpdated = true;
            this._router.navigate(['/home']);
          }),
          catchError(() => {
            this.isUpdated = false;
            this.setFormValidationError();
            return EMPTY;
          }),
          untilDestroyed(this)
        )
        .subscribe()
        .add(() => {
          this.isProcessing = false;
          this._cdr.markForCheck();
        });
    }
  }

  protected override createForm() {
    return this._fb.group<PasswordResetModel>({
      newPassword: ['', passwordValidators],
      confirmPassword: ['', [Validators.required, matchValues('newPassword')]],
    });
  }

  private setFormValidationError(): void {
    this.form.controls.newPassword.updateValueAndValidity();
    this.form.controls.newPassword.setErrors({
      serverError: ErrorMessages.serverError,
    });
  }
}

@NgModule({
  declarations: [ResetPasswordPage],
  imports: [
    RouterModule.forChild([{ path: '', component: ResetPasswordPage }]),
    CommonModule,
    ReactiveFormsModule,
    CosInputModule,
    CosButtonModule,
    RouterModule,
    PasswordResetFormModule,
    LogoComponentModule,
  ],
})
export class ResetPasswordPageModule {}
