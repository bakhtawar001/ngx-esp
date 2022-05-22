// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  preset: 'jest-puppeteer-docker',
  globalSetup: './setup.js',
  globalTeardown: './teardown.js',

  // reporters: [
  //   'default',
  //   [
  //     'jest-junit',
  //     {
  //       outputDirectory: './reports',
  //       outputName: './jest-junit.xml',
  //     },
  //   ],
  // ],

  roots: ['../../libs/cosmos'],

  setupFilesAfterEnv: ['./test-environment.setup.js'],

  testMatch: ['**/*.vis.test.js'],

  //   testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
