/* eslint-disable @angular-eslint/use-component-selector */
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgModule,
} from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ERROR_MESSAGES } from '@asi/auth';
import { ValidateEmail } from '@cosmos/common';
import { CosButtonModule } from '@cosmos/components/button';
import { CosInputModule } from '@cosmos/components/input';
import { FormBuilder, FormControl } from '@cosmos/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { LoginService } from '@smartlink/auth';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@UntilDestroy()
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPage {
  public isResetEmailSent = false;
  public resetPasswordEmail = new FormControl<string>('', [
    Validators.required,
    ValidateEmail,
  ]);

  constructor(
    protected readonly fb: FormBuilder,
    protected readonly store: Store,
    protected readonly route: ActivatedRoute,
    protected readonly _cdr: ChangeDetectorRef,
    private loginService: LoginService
  ) {
    this.setForgotPasswordEmailValidation();
  }

  sendResetPasswordEmail(): void {
    if (this.resetPasswordEmail.invalid) {
      this.resetPasswordEmail.markAsTouched();
      return;
    }

    this.loginService
      .sendResetEmail(this.resetPasswordEmail.value)
      .pipe(
        tap(() => {
          this.isResetEmailSent = true;
        }),
        catchError((err) => {
          if (err instanceof HttpResponse && err.status !== 404)
            this.resetPasswordEmail.setErrors({
              error: ERROR_MESSAGES.GENERIC_ERROR,
            });
          return EMPTY;
        }),
        untilDestroyed(this)
      )
      .subscribe()
      .add(() => {
        this._cdr.markForCheck();
      });
  }

  private setForgotPasswordEmailValidation() {
    if (this.resetPasswordEmail.hasError('required'))
      this.resetPasswordEmail.setErrors({
        error: ERROR_MESSAGES.EMAIL_EMPTY,
      });
    else if (this.resetPasswordEmail.hasError('email'))
      this.resetPasswordEmail.setErrors({
        error: ERROR_MESSAGES.EMAIL_INVALID,
      });
    return;
  }
}

@NgModule({
  declarations: [ForgotPasswordPage],
  imports: [
    RouterModule.forChild([{ path: '', component: ForgotPasswordPage }]),
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CosInputModule,
    CosButtonModule,
  ],
})
export class ForgotPasswordPageModule {}
