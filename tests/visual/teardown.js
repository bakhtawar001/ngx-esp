const fs = require('fs');
const { teardown: teardownPuppeteer } = require('jest-puppeteer-docker');

module.exports = async function globalTeardown(jestConfig) {
  if (process.env.CI_ENV) {
    global.__SERVER__.close();
  }

  await teardownPuppeteer(jestConfig);
};
