import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  Host,
  Inject,
  InjectionToken,
  Input,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Dictionary } from '@cosmos/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { CosFormField } from './form-field.component';

export type ErrMsgFn = (err: any) => string;
export type ErrorsMap = Dictionary<string | ErrMsgFn>;

export const COS_FORM_ERRORS = new InjectionToken<ErrorsMap>(
  'COS_FORM_ERRORS',
  {
    providedIn: 'root',
    factory: () => {
      return {};
    },
  }
);

@UntilDestroy()
@Component({
  selector: 'cos-error:not([controlErrorsIgnore])',
  template: '{{ errorText$ | async }}',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosErrorComponent implements AfterContentInit {
  @Input() controlErrors: ErrorsMap = {};
  controlErrors$ = new BehaviorSubject<ValidationErrors | null>(null);

  errorText$ = this.controlErrors$
    .asObservable()
    .pipe(map((controlErrors) => this._mapErrors(controlErrors)));

  constructor(
    @Inject(COS_FORM_ERRORS) private globalErrors: ErrorsMap,
    @Host()
    protected host: CosFormField
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get control() {
    if (this.inputRef && this.inputRef.ngControl) {
      return this.inputRef.ngControl.control || this.inputRef.ngControl;
    } else {
      return null;
    }
  }

  get inputRef() {
    return this.host?._control;
  }

  // Setup all initial tooling
  ngAfterContentInit() {
    if (this.control) {
      const statusChanges$ = (<Observable<any>>(
        this.control.statusChanges
      ))!.pipe(startWith(true), distinctUntilChanged());

      merge(statusChanges$, this.control.valueChanges!)
        .pipe(untilDestroyed(this))
        .subscribe(() => this.controlErrors$.next(this.control!.errors));
    }
  }

  private _mapErrors(controlErrors: ValidationErrors | null) {
    if (controlErrors) {
      const [firstKey] = Object.keys(controlErrors);
      const getError =
        this.controlErrors[firstKey] || this.globalErrors[firstKey];

      if (!getError) {
        return null;
      }

      if (typeof getError === 'function') {
        if (
          firstKey.endsWith('length') &&
          typeof controlErrors[firstKey] !== 'string'
        ) {
          const label =
            this.host?.label?.nativeElement?.innerText?.toLowerCase();

          return getError({
            ...controlErrors[firstKey],
            label,
          });
        }

        return getError(controlErrors[firstKey]);
      }

      return getError;
    } else {
      return null;
    }
  }
}
