/**
 * @description This will be provided through Terser global definitions by the Angular compiler,
 * see https://github.com/angular/angular/blob/master/packages/compiler-cli/private/tooling.ts#L26.
 *
 * Assume we have such code expression:
 * ```ts
 * if (ngDevMode) { throw new Error('arguments are not valid'); }
 * ```
 * Terser can understand what is `ngDevMode` since the code is parsed into tokens. It'll
 * encounter that expression in the following form:
 * ```ts
 * if (false) { throw new Error('arguments are not valid'); }
 * ```
 * This is considered as a dead-code and will be eliminated from the production bundle.
 *
 * Don't use the `isDevMode()` function.
 *
 * Note that the `isDevMode()` is a runtime function and has nothing to do with tree-shaking.
 */
declare const ngDevMode: boolean;
