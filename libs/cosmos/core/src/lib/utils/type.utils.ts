/**
 * Wrapping a function parameter which expects an array with this type
 * will prevent the caller from being allowed to specify an empty array
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Wrapping a generic type parameter usage with this will prevent typescript from
 * inferring the generic type from this usage
 */
export type NoInfer<T> = [T][T extends any ? 0 : never];

/**
 * This type 'disallows' all property access by returning void.
 * This is used to prevent the mistaken access of
 * a property as opposed to a function call.
 * eg. trackByFn['id'] is invalid, it should be trackByFn(['id'])
 * Also disallows the default Function methods, but this
 * is probably good for most use cases of this function
 */
export type DisallowFunctionPropertyAccess = {
  [disallow: string]: void;
  [disallow: number]: void;
};
