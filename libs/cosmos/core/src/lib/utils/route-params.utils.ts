import { ParamMap } from '@angular/router';
import { NonEmptyArray } from './type.utils';

export type ParamObject<
  TRequired extends string | void = void,
  TOptional extends string | void = void
> = Readonly<
  { [key in Exclude<TRequired, void>]: string } & {
    [key in Exclude<TOptional, void>]?: string;
  }
>;

/**
 * Extracts the specified properties from the route params and provides
 * a type safe result object for accessing the values.
 * If any of the required properties are missing then null is returned to
 * indicate that the route is not compatible with the requested information.
 * @param route The route to extract the parameters from
 * @param props The required props to extract from the route or an object
 *   with the required and optional parameters listed separately
 * @returns An object with the requested properties populated, or
 *   null if any required properties were missing
 */
export function getParamsObject<
  TRequiredPropNames extends string | void = void,
  TOptionalPropNames extends string | void = void
>(
  paramMap: ParamMap,
  props:
    | NonEmptyArray<TRequiredPropNames>
    | {
        required?: NonEmptyArray<TRequiredPropNames>;
        optional?: NonEmptyArray<TOptionalPropNames>;
      }
): null | ParamObject<TRequiredPropNames, TOptionalPropNames> {
  if (Array.isArray(props)) {
    props = {
      required: props,
    };
  }
  const requiredKeys = props.required || [];
  const optionalKeys = props.optional || [];
  const missingKeys = requiredKeys.filter(
    (key) => !paramMap.keys.includes(key as string)
  );
  if (missingKeys.length > 0) {
    return null;
  }
  const allProps = [...requiredKeys, ...optionalKeys];
  const result = allProps.reduce((obj, prop) => {
    if (paramMap.has(prop as string)) {
      obj[prop] = paramMap.get(prop as string);
    }
    return obj;
  }, {} as any);
  return result as ParamObject<TRequiredPropNames, TOptionalPropNames>;
}
