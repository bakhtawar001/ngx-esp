import { Directive, InjectionToken } from '@angular/core';

/**
 * Injection token that can be used to reference instances of `MatPrefix`. It serves as
 * alternative token to the actual `MatPrefix` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const COS_PREFIX = new InjectionToken<CosPrefix>('CosPrefix');

/** Prefix to be placed in front of the form field. */
@Directive({
  selector: '[cosPrefix]',
  providers: [{ provide: COS_PREFIX, useExisting: CosPrefix }],
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class CosPrefix {}
