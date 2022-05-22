import { Directive, InjectionToken } from '@angular/core';

/**
 * Injection token that can be used to reference instances of `MatPrefix`. It serves as
 * alternative token to the actual `MatPrefix` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const COS_SUFFIX = new InjectionToken<CosSuffix>('CosSuffix');

/** Suffix to be placed at the end of the form field. */
@Directive({
  selector: '[cosSuffix]',
  providers: [{ provide: COS_SUFFIX, useExisting: CosSuffix }],
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class CosSuffix {}
