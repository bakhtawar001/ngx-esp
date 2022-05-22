type FeatureFlagMatchOptions<TFeatureFlags extends string> =
  | TFeatureFlags
  | `!${TFeatureFlags}`;

export interface FeatureFlagOptions<TFeatureFlags extends string = string> {
  /**
   * The feature flags to match can be provided as a `string` or as a `string[]` to the `featureFlags.matches` property.
   * Feature flags can be negated by including a `!` character before the feature flag identifier string.
   */
  matches?:
    | FeatureFlagMatchOptions<TFeatureFlags>
    | FeatureFlagMatchOptions<TFeatureFlags>[];
}
