import { ChangeDetectorRef, Directive, NgZone } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@cosmos/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { Auth } from '../actions';
import { AuthQueries, LoginFormQueries } from '../queries';
import { LoginRequest } from '../types';

export const ERROR_MESSAGES = {
  EMAIL_EMPTY: 'Please enter an email.',
  EMAIL_INVALID: 'The email address is invalid.',
  COMBINATION_INVALID: 'Invalid username/email and password combination.',
  GENERIC_ERROR: 'Something went wrong, please try again later.',
};

@UntilDestroy()
@Directive()
export abstract class BaseLoginComponent {
  public loginForm = this._createForm();

  private error$ = this.store.select(AuthQueries.getLoadError);

  /**
   * Constructor
   *
   * @param {FormBuilder} _fb
   * @param {Store} _store
   * @param {ActivatedRoute} _route
   */
  constructor(
    private readonly _ngZone: NgZone,
    protected readonly fb: FormBuilder,
    protected readonly store: Store,
    protected readonly route: ActivatedRoute,
    protected readonly _cdr: ChangeDetectorRef
  ) {
    const storedLogin = this.store.selectSnapshot(
      LoginFormQueries.getFormValues
    );
    this.loginForm.patchValue(storedLogin);

    this.error$.pipe(untilDestroyed(this)).subscribe((err: any) => {
      if (!err || err.devErrorMessage === 'Unauthenticated') return;
      this.loginForm.get('password')!.setErrors({
        serverError: err.message?.detail?.includes('InvalidUserCredentials')
          ? ERROR_MESSAGES.COMBINATION_INVALID
          : err
          ? ERROR_MESSAGES.GENERIC_ERROR
          : '',
      });
      this._cdr.markForCheck();
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  login(credentials: LoginRequest, redirectUrl?: string): void {
    this._ngZone.run(() => {
      this.store.dispatch(
        new Auth.LoginWithCredentials(
          credentials,
          redirectUrl ?? this.route?.snapshot.queryParams.redirectUrl
        )
      );
    });
  }

  /**
   * Log in with credentials
   *
   */
  loginWithCredentials(redirectUrl?: string): void {
    if (this.loginForm.invalid) return;

    this.login(this.loginForm.value, redirectUrl);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _createForm() {
    return this.fb.group<LoginRequest>({
      asi_number: [''],
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [true],
    });
  }
}
