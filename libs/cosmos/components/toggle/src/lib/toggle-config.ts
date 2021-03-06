/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';

/** Default `mat-slide-toggle` options that can be overridden. */
export interface CosSlideToggleDefaultOptions {
  /** Whether toggle action triggers value changes in slide toggle. */
  disableToggleValue?: boolean;
  /**
   * Whether drag action triggers value changes in slide toggle.
   * @deprecated No longer being used.
   * @breaking-change 10.0.0
   */
  disableDragValue?: boolean;
}

/** Injection token to be used to override the default options for `mat-slide-toggle`. */
export const COS_SLIDE_TOGGLE_DEFAULT_OPTIONS = new InjectionToken<
  CosSlideToggleDefaultOptions
>('cos-slide-toggle-default-options', {
  providedIn: 'root',
  factory: () => ({ disableToggleValue: false }),
});
