/**
 * https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
 *
 * Errors are now defaulted to the `unknown` type (it was `any` previously).
 */
export function getErrorMessage(error: unknown): string | null {
  return error instanceof Error ? error.message : null;
}
