const { setup: setupPuppeteer } = require('jest-puppeteer-docker');
const express = require('express');
const path = require('path');

module.exports = async (jestConfig) => {
  if (process.env.CI_ENV) {
    const app = express();

    app.use(
      express.static(path.join(__dirname, '../../dist/storybook/cosmos'))
    );

    app.get('/', (req, res) => {
      res.sendFile('index.html');
    });

    global.__SERVER__ = app.listen(4400);
  }
  await setupPuppeteer(jestConfig);
};
