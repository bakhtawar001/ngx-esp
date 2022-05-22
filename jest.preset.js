const nxPreset = require('@nrwl/jest/preset');

module.exports = {
  ...nxPreset,
  bail: true,
  // The `@nrwl/jest/preset` comes with `testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)']`,
  // we don't wanna handle `.test.js` files, e.g. `vis.test.js`.
  testMatch: ['**/+(*.)+(spec).+(ts|js)'],
  coverageReporters: ['html', 'text'],
  reporters: ['default'],
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
    '.+\\.(scss|png|jpg)$': 'identity-obj-proxy',
  },
};
