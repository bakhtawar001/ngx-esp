export type AnyFunction = (...args: any[]) => any;

export function isFunction(value: any): value is AnyFunction {
  return typeof value === 'function';
}
