import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { ValidateEmail } from '@cosmos/common';
import { CosInputModule } from '@cosmos/components/input';
import { FormControl, FormControlComponent } from '@cosmos/forms';
import { UserProfileQueries } from '@esp/auth';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { isEqual } from 'lodash-es';
import { of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  take,
} from 'rxjs/operators';
import { ProfilePageLocalState } from '../../local-state';
import { errorMessageDisplay } from '../../utils';

@UntilDestroy()
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-signon-email-panel-row-form',
  templateUrl: './signon-email-panel-row.form.html',
  styleUrls: ['./signon-email-panel-row.form.scss'],
})
export class SignonEmailPanelRowForm extends FormControlComponent<string> {
  updateLoginEmail = this._updateLoginEmail.bind(this);

  constructor(
    public state: ProfilePageLocalState,
    private readonly _store: Store
  ) {
    super();

    const state$ = state.connect(this);
    state$
      .pipe(
        take(1),
        map((x) => x.user),
        distinctUntilChanged(isEqual),
        untilDestroyed(this)
      )
      .subscribe((user) => {
        this.control.reset(user?.LoginEmail);
      });

    state$
      .pipe(
        map((x) => x.updateLoginEmailOperation),
        distinctUntilChanged(),
        untilDestroyed(this)
      )
      .subscribe((status) => {
        if (status?.error) {
          this.control.updateValueAndValidity();
          this.control.setErrors({
            serverError: errorMessageDisplay(
              { error: status.error.message },
              {
                alreadyExists:
                  'Email address is already assigned to another user. Choose another email address.',
              },
              'Log-in Email'
            ),
          });
        }
      });
  }

  private _updateLoginEmail() {
    this.state.updateLoginEmail(this.control.value);
    return this._store
      .select(UserProfileQueries.updateLoginEmailOperation)
      .pipe(
        filter((o) => !o.inProgress),
        map((o) => o.success && !o.error),
        catchError(() => of(false))
      );
  }

  protected override createForm(): FormControl<string> {
    return this._fb.control<string>('', [
      Validators.required,
      Validators.maxLength(100),
      ValidateEmail,
    ]);
  }
}

@NgModule({
  declarations: [SignonEmailPanelRowForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    CosInputModule,

    AsiPanelEditableRowModule,
  ],
  exports: [SignonEmailPanelRowForm],
})
export class SignonEmailPanelRowFormModule {}
