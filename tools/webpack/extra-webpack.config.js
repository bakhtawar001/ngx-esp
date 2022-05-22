const webpack = require('webpack');

const {
  AugmentAngularWebpackPlugin,
} = require('./augment-angular-webpack-plugin');

const pluginsToExcludeDuringDevelopment = [
  // The circular dependency plugin causes incremental speeds to be 3x slower than they should be
  // so we disable it on development and make it a hard error on production builds so that we don't miss the warning.
  // https://github.com/angular/angular-cli/issues/20235#issuecomment-797015131
  'CircularDependencyPlugin',
  'CommonJsUsageWarnPlugin',
  'NgBuildAnalyticsPlugin',
  // We don't need to check budgets during the local development.
  'AnyComponentStyleBudgetChecker',
];

const shouldWatchNodeModulesChanges = process.env.DEBUG === 'true';

/**
 * @param {import('webpack').Configuration} config
 */
module.exports = (config) => {
  config.resolve.alias = {
    // The encore application uses `lodash-es`, but some NPM modules still use the `lodash` package
    // (not `lodash-es`). The `lodash` package is not tree-shakable, so we bundle the `lodash` package twice (since
    // we bundle both `lodash` and `lodash-es`). The `resolve` option will redirect all `require` and `import` expressions to `lodash-es`.
    // If any NPM module has something like this within its code: `const { isPlainObject } = require('lodash')`, then Webpack will resolve
    // `lodash` to `lodash-es` and the `isPlainObject` will be imported from the `lodash-es`.
    lodash: require.resolve('lodash-es'),
  };

  if (shouldWatchNodeModulesChanges) {
    // Webpack 5 doesn't watch file changes within `node_modules` thus preventing the possibility to debug.
    // Let's watch changes only when the `DEBUG` variable is set to `true`, e.g. `DEBUG=true nx serve encore`.
    config.snapshot = { ...config.snapshot, managedPaths: [] };
  }

  if (config.mode === 'development') {
    config.plugins = config.plugins.filter(
      (plugin) =>
        !pluginsToExcludeDuringDevelopment.includes(plugin.constructor.name)
    );
  } else {
    config.plugins.forEach((plugin) => {
      if (plugin.constructor.name === 'CircularDependencyPlugin') {
        plugin.options.failOnError = true;
      }
    });
  }

  config.plugins.push(
    new webpack.DefinePlugin({
      ...getDefinitionsIfBuildIsBeingRunByCypressExecutor(),
      'process.env.GIT_SHA': JSON.stringify(
        // https://docs.netlify.com/configure-builds/environment-variables/#git-metadata
        process.env.COMMIT_REF || 'local-dev'
      ),
      'process.env.GIT_BRANCH': JSON.stringify(
        process.env.BRANCH || 'local-dev'
      ),
    })
  );

  new AugmentAngularWebpackPlugin(config);

  return config;
};

function getDefinitionsIfBuildIsBeingRunByCypressExecutor() {
  // The `encore:serve` target might be spawned by Cypress, for instance, when running `nx e2e encore-e2e`.
  // Nx will expose the `NX_TASK_TARGET_PROJECT` environment variable into the shell to know that `encore:serve` target
  // was spawned by the Cypress executor.
  // When running `nx e2e encore-e2e` the `process.env.NX_TASK_TARGET_PROJECT` will equal `encore-e2e`.
  const buildIsBeingRunByCypressExecutor =
    typeof process.env.NX_TASK_TARGET_PROJECT === 'string' &&
    process.env.NX_TASK_TARGET_PROJECT.endsWith('-e2e');

  return {
    // Do not enable Segment if Cypress executor runs the `encore:serve` target.
    'process.env.SEGMENT_ENABLED': JSON.stringify(
      buildIsBeingRunByCypressExecutor === false
    ),
  };
}
