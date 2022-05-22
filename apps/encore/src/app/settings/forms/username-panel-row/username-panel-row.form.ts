import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosInputModule } from '@cosmos/components/input';
import { FormControlComponent } from '@cosmos/forms';
import { UserProfileQueries } from '@esp/auth';
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

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-username-panel-row-form',
  templateUrl: './username-panel-row.form.html',
  styleUrls: ['./username-panel-row.form.scss'],
})
export class UsernamePanelRowForm extends FormControlComponent<string> {
  patternError = {
    pattern: "Only alphanumeric characters and &'()_-@;:., are allowed!",
  };

  updateUsername = this._updateUsername.bind(this);

  constructor(
    private readonly _store: Store,
    public state: ProfilePageLocalState
  ) {
    super();

    const state$ = state.connect(this);
    state$
      .pipe(
        take(1),
        map((x) => x.user),
        distinctUntilChanged(isEqual)
      )
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      .subscribe((user) => {
        this.control?.reset(user?.UserName);
      });

    state$
      .pipe(
        map((x) => x.updateUserNameOperation),
        distinctUntilChanged()
      )
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      .subscribe((status) => {
        if (status?.error) {
          this.control.updateValueAndValidity();
          this.control.setErrors({
            serverError: errorMessageDisplay(
              { error: status.error.message },
              {
                alreadyExists:
                  'Username already exists. Choose another Username.',
              },
              'Username'
            ),
          });
        }
      });
  }

  private _updateUsername() {
    this.state.updateUserName(this.control.value);
    return this._store.select(UserProfileQueries.updateUserNameOperation).pipe(
      filter((o) => !o.inProgress),
      map((o) => o.success && !o.error),
      catchError(() => of(false))
    );
  }

  protected override createForm() {
    return this._fb.control<string>('', [
      Validators.required,
      Validators.pattern(/^[A-Za-z0-9&'()_\-@;:.,]+$/),
      Validators.maxLength(50),
    ]);
  }
}

@NgModule({
  declarations: [UsernamePanelRowForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    CosInputModule,

    AsiPanelEditableRowModule,
  ],
  exports: [UsernamePanelRowForm],
})
export class UsernamePanelRowFormModule {}
