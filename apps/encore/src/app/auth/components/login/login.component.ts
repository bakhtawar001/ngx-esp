import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BaseLoginComponent } from '@asi/auth';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { CosPasswordToggleComponentModule } from '@cosmos/components/password-toggle';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isEqual } from 'lodash-es';
import { distinctUntilChanged } from 'rxjs/operators';

@UntilDestroy()
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends BaseLoginComponent implements OnInit {
  ngOnInit() {
    this.loginForm.valueChanges
      .pipe(distinctUntilChanged(isEqual), untilDestroyed(this))
      .subscribe({
        next: () => {
          const passwordControl = this.loginForm.get('password');

          if (passwordControl.hasError('serverError')) {
            // Previously is was used with `passwordControl.removeError('serverError')`.
            const { serverError, ...errors } = passwordControl.errors;

            passwordControl.setErrors(errors);
            passwordControl.updateValueAndValidity();

            this.loginForm.updateValueAndValidity();
            this._cdr.markForCheck();
          }
        },
      });
  }
}

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CosInputModule,
    CosButtonModule,
    CosCheckboxModule,
    CosPasswordToggleComponentModule,
    RouterModule,
    CosFormFieldModule,
  ],
  exports: [LoginComponent],
})
export class LoginComponentModule {}
