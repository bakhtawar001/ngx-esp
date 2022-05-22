import { FeatureFlagOptions } from './feature-flag-options';

/**
 * The properties described by this interface are used by the `FeatureFlagsGuard` in a route config.
 * Better type safety can be provided for route data by using the `TypedRoute` interface and supplying
 * this `FeatureFlagsRouteData` interface as the custom type parameter.
 * Further type safety can be provided by supplying a feature flag keys string type union
 * as the generic type parameter of this `FeatureFlagsRouteData` interface.
 * The feature flags to match can be provided as a `string` or as a `string[]` to the `featureFlags.matches` property.
 * Feature flags can be negated by including a `!` character before the feature flag identifier string.
 * The `featureFlags.noMatchRedirectsTo` property can be provided to supply a url to redirect to if the supplied
 * `featureFlags.matches` do not match the current flag statuses.
 * @example
 *  ```
 *  const routes: TypedRoute<FeatureFlagsRouteData<'foo' | 'bar' | 'baz'>>[] = [
 *   {
 *     path: 'lazy',
 *     loadChildren: async () => (await import('./my-lazy/my-lazy.module')).MyLazyModule,
 *     data: {
 *       preload: true,
 *       featureFlags: {
 *         matches: ['foo', '!bar'],
 *       },
 *     },
 *     canLoad: [FeatureFlagsGuard],
 *   }
 * ]
 * ```
 */
export interface FeatureFlagsRouteData<TFeatureFlags extends string = string> {
  featureFlags?: FeatureFlagOptions<TFeatureFlags> & {
    /**
     * The `featureFlags.noMatchRedirectsTo` property can be provided to supply a url to redirect to if the supplied
     * `featureFlags.matches` do not match the current flag statuses.
     */
    noMatchRedirectsTo?: string | string[];
  };
}
