import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  NgModule,
} from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { matchValues, passwordValidators } from '@cosmos/common';
import { CosButtonModule } from '@cosmos/components/button';
import { CosInputModule } from '@cosmos/components/input';
import { CosPasswordToggleComponentModule } from '@cosmos/components/password-toggle';
import { FormGroup, FormGroupComponent } from '@cosmos/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

export interface PasswordResetFormModel {
  existingPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

@UntilDestroy()
@Component({
  selector: 'esp-password-reset-form',
  templateUrl: './password-reset.form.html',
  styleUrls: ['./password-reset.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetForm
  extends FormGroupComponent<PasswordResetFormModel>
  implements AfterViewInit
{
  newPasswordVisible = false;
  newPasswordConfirmVisible = false;
  specialChars = '~`!@#$%^&*()_+-=[]{}|,.<>/?';

  override createForm(): FormGroup {
    return this._fb.group<PasswordResetFormModel>({
      existingPassword: ['', [Validators.required]],
      newPassword: ['', passwordValidators],
      confirmPassword: ['', [Validators.required, matchValues('newPassword')]],
    });
  }

  override ngAfterViewInit(): void {
    this.getFormControl('newPassword')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe(() => {
        this.getFormControl('confirmPassword').updateValueAndValidity();
      });
  }
}

@NgModule({
  imports: [
    CommonModule,
    CosButtonModule,
    CosInputModule,
    CosPasswordToggleComponentModule,
    ReactiveFormsModule,
  ],

  exports: [PasswordResetForm],
  declarations: [PasswordResetForm],
})
export class PasswordResetFormModule {}
