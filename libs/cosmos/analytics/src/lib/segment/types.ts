export interface SegmentConfig {
  // The `string` is allowed if the value is coming from `process.env.*`. Node.js typings
  // ensure that `process.env.*` are strings, but Webpack's DefinePlugin may replace them with any value.
  enabled: string | boolean;
  apiKey?: string;
}
