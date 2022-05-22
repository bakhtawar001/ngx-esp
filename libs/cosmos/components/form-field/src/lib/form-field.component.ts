/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// Borrows implementation from Material Form Field so we should ignore and keep what we have
// See here as well: https://github.com/ReactiveX/rxjs/issues/4772#issuecomment-491553380

import { Directionality } from '@angular/cdk/bidi';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  HostBinding,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { UniqueIdService } from '@cosmos/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { CosErrorDirective } from './error';
import { CosFormFieldControlDirective } from './form-field-control.directive';
import {
  getCosFormFieldDuplicatedHintError,
  getCosFormFieldMissingControlError,
} from './form-field-errors';
import { CosHint } from './hint';
import { CosLabel } from './label';
import { CosPrefix, COS_PREFIX } from './prefix';
import { CosSuffix, COS_SUFFIX } from './suffix';

export interface CosFormFieldDefaultOptions {
  hideRequiredMarker?: boolean;
}

/**
 * Injection token that can be used to configure the
 * default options for all form field within an app.
 */
export const COS_FORM_FIELD_DEFAULT_OPTIONS =
  new InjectionToken<CosFormFieldDefaultOptions>(
    'COS_FORM_FIELD_DEFAULT_OPTIONS'
  );

/**
 * Injection token that can be used to inject an instances of `MatFormField`. It serves
 * as alternative token to the actual `MatFormField` class which would cause unnecessary
 * retention of the `MatFormField` class and its component metadata.
 */
export const COS_FORM_FIELD = new InjectionToken<CosFormField>('CosFormField');

/** Container for form controls that applies Material Design styling and behavior. */
@Component({
  selector: 'cos-form-field',
  templateUrl: 'form-field.component.html',
  styleUrls: ['form-field.component.scss'],
  providers: [UniqueIdService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[class.cos-form-field]': 'true',
    '[class.cos-form-field-invalid]': '_control.errorState',
    '[class.cos-form-field-disabled]': '_control.disabled',
    '[class.cos-form-field-autofilled]': '_control.autofilled',
    '[class.cos-form-field-focused]': '_control.focused',
    '[class.ng-untouched]': '_shouldForward("untouched")',
    '[class.ng-touched]': '_shouldForward("touched")',
    '[class.ng-pristine]': '_shouldForward("pristine")',
    '[class.ng-dirty]': '_shouldForward("dirty")',
    '[class.ng-valid]': '_shouldForward("valid")',
    '[class.ng-invalid]': '_shouldForward("invalid")',
    '[class.ng-pending]': '_shouldForward("pending")',
  },
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class CosFormField
  implements AfterContentInit, AfterContentChecked, AfterViewInit, OnDestroy
{
  private _destroyed = new Subject<void>();

  @HostBinding('class.cos-focused')
  get isFocused() {
    return this._control.focused;
  }

  /** Whether the required marker should be hidden. */
  @Input()
  get hideRequiredMarker(): boolean {
    return this._hideRequiredMarker;
  }
  set hideRequiredMarker(value: boolean) {
    this._hideRequiredMarker = coerceBooleanProperty(value);
  }
  private _hideRequiredMarker: boolean;

  // Unique id for the internal form field label.
  _labelId = `${this._uniqueIdService.getUniqueIdForDom(
    'cos-form-field-label'
  )}`;

  @ContentChild(CosLabel, { read: ElementRef }) label!: ElementRef;

  @ViewChild('connectionContainer', { static: true })
  _connectionContainerRef!: ElementRef;

  // TODO: Remove cast once https://github.com/angular/angular/pull/37506 is available.
  @ContentChildren(COS_PREFIX as any, { descendants: true })
  _prefixChildren!: QueryList<CosPrefix>;

  @ContentChildren(COS_SUFFIX as any, { descendants: true })
  _suffixChildren!: QueryList<CosSuffix>;

  @ContentChild(CosFormFieldControlDirective)
  _controlNonStatic!: CosFormFieldControlDirective<any>;

  @ContentChild(CosFormFieldControlDirective, { static: true })
  _controlStatic!: CosFormFieldControlDirective<any>;

  get _control() {
    return (
      this._explicitFormFieldControl ||
      this._controlNonStatic ||
      this._controlStatic
    );
  }
  set _control(value) {
    this._explicitFormFieldControl = value;
  }
  private _explicitFormFieldControl!: CosFormFieldControlDirective<any>;

  @ContentChild(CosLabel) _labelChildNonStatic!: CosLabel;
  @ContentChild(CosLabel, { static: true })
  _labelChildStatic!: CosLabel;
  get _labelChild() {
    return this._labelChildNonStatic || this._labelChildStatic;
  }

  @ContentChildren(CosErrorDirective, { descendants: true })
  _errorChildren!: QueryList<CosErrorDirective>;
  @ContentChildren(CosHint, { descendants: true })
  _hintChildren!: QueryList<CosHint>;

  constructor(
    public _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional()
    @Inject(COS_FORM_FIELD_DEFAULT_OPTIONS)
    @Optional()
    @Inject(COS_FORM_FIELD_DEFAULT_OPTIONS)
    _defaults: CosFormFieldDefaultOptions,
    private _uniqueIdService: UniqueIdService
  ) {
    this._hideRequiredMarker =
      _defaults && _defaults.hideRequiredMarker != null
        ? _defaults.hideRequiredMarker
        : false;
  }

  ngAfterContentInit() {
    this._validateControlChild();

    const control = this._control;

    if (control.controlType) {
      this._elementRef.nativeElement.classList.add(
        `cos-form-field-type-${control.controlType}`
      );
    }

    // Subscribe to changes in the child control state in order to update the form field UI.
    control.stateChanges
      .pipe(startWith(null!), takeUntil(this._destroyed))
      .subscribe(() => {
        this._syncDescribedByIds();
        this._changeDetectorRef.markForCheck();
      });

    // Run change detection if the value changes.
    if (control.ngControl && control.ngControl.valueChanges) {
      control.ngControl.valueChanges
        .pipe(takeUntil(this._destroyed))
        .subscribe(() => this._changeDetectorRef.markForCheck());
    }

    // Re-validate when the number of hints changes.
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this._hintChildren.changes.pipe(startWith(null)).subscribe(() => {
      this._processHints();
      this._changeDetectorRef.markForCheck();
    });

    // Update the aria-described by when the number of errors changes.
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this._errorChildren.changes.pipe(startWith(null)).subscribe(() => {
      this._syncDescribedByIds();
      this._changeDetectorRef.markForCheck();
    });
  }

  ngAfterContentChecked() {
    this._validateControlChild();
  }

  ngAfterViewInit() {
    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** Determines whether a class from the NgControl should be forwarded to the host element. */
  _shouldForward(prop: keyof NgControl): boolean {
    const ngControl = this._control ? this._control.ngControl : null;
    return ngControl && ngControl[prop];
  }

  _hasLabel() {
    return !!this._labelChild;
  }

  /** Determines whether to display hints or errors. */

  _getDisplayedMessages(): 'error' | 'hint' {
    return this._errorChildren &&
      this._errorChildren.length > 0 &&
      this._control.errorState
      ? 'error'
      : 'hint';
  }

  /** Does any extra processing that is required when handling the hints. */
  private _processHints() {
    this._validateHints();
    this._syncDescribedByIds();
  }

  /**
   * Ensure that there is a maximum of one of each `<cos-hint>` alignment specified, with the
   * attribute being considered as `align="start"`.
   */
  private _validateHints() {
    if (this._hintChildren) {
      let startHint: CosHint;
      let endHint: CosHint;
      this._hintChildren.forEach((hint: CosHint) => {
        if (hint.align === 'start') {
          if (startHint) {
            throw getCosFormFieldDuplicatedHintError('start');
          }
          startHint = hint;
        } else if (hint.align === 'end') {
          if (endHint) {
            throw getCosFormFieldDuplicatedHintError('end');
          }
          endHint = hint;
        }
      });
    }
  }

  /**
   * Sets the list of element IDs that describe the child control. This allows the control to update
   * its `aria-describedby` attribute accordingly.
   */
  private _syncDescribedByIds() {
    if (this._control) {
      let ids: string[] = [];

      if (this._getDisplayedMessages() === 'hint') {
        const startHint = this._hintChildren
          ? this._hintChildren.find((hint) => hint.align === 'start')
          : null;
        const endHint = this._hintChildren
          ? this._hintChildren.find((hint) => hint.align === 'end')
          : null;

        if (startHint) {
          ids.push(startHint.id);
        }

        if (endHint) {
          ids.push(endHint.id);
        }
      } else if (this._errorChildren) {
        ids = this._errorChildren.map((error) => error.id);
      }

      this._control.setDescribedByIds(ids);
    }
  }

  /** Throws an error if the form field's control is missing. */
  protected _validateControlChild() {
    if (!this._control) {
      throw getCosFormFieldMissingControlError();
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  static ngAcceptInputType_hideRequiredMarker: BooleanInput;
}
