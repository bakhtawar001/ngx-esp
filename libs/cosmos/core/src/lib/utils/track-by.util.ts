import { TrackByFunction } from '@angular/core';
import {
  DisallowFunctionPropertyAccess,
  NoInfer,
  NonEmptyArray,
} from './type.utils';

/**
 * The TrackBy type is constructed from the underlying Angular TrackByFunction
 * function type so that it can specify a subset of properties and be
 * considered valid (unlike the underlying TrackByFunction).
 */
type TrackBy<TProps extends keyof any> = <TItem extends Record<TProps, any>>(
  ...args: Parameters<TrackByFunction<TItem>>
) => ReturnType<TrackByFunction<TItem>>;

type TrackByFactory<
  TProps extends keyof any
> = DisallowFunctionPropertyAccess & {
  (props: NonEmptyArray<TProps>): TrackBy<TProps>;
};

export function trackItem<TItem extends object>(): TrackByFactory<keyof TItem>;
export function trackItem<TItem extends object>(
  props: NonEmptyArray<keyof NoInfer<TItem>>
): TrackByFunction<TItem>;
export function trackItem<TItem extends object>(
  props?: NonEmptyArray<keyof NoInfer<TItem>>
): TrackByFactory<keyof TItem> | TrackByFunction<TItem> {
  if (props && props.length > 0) {
    return trackByFn(props as NonEmptyArray<string>) as TrackByFunction<TItem>;
  }
  return trackByFn as TrackByFactory<keyof TItem>;
}

export function trackByFn<TProps extends string>(
  props: NonEmptyArray<TProps>
): TrackBy<TProps> {
  return <TItem extends Record<TProps, any>>(index: number, item: TItem) => {
    const trackingValue = props
      .map((key) => item[key])
      .filter(Boolean)
      .map((val) => val + '')
      .join(' - ');
    return trackingValue || index;
  };
}
