const { configureToMatchImageSnapshot } = require('jest-image-snapshot');
const initExtensions = require('puppeteer-extensions');

jest.setTimeout(10000);

global.extensions = initExtensions(global.page);

global.defaultViewports = [375, 1024];

global.loadStorybookPage = async (urlPath) => {
  await global.page.goto(
    `http://host.docker.internal:4400/iframe.html?id=${urlPath}`
  );
  await global.extensions.turnOffAnimations();
};

global.screenshot = async (selector = 'body') => {
  const element = await page.$(selector);
  const image = await element.screenshot();

  expect(image).toMatchImageSnapshot();
};

global.testMultipleViewports = (testToRun, customViewports = []) => {
  const viewports = new Set([...global.defaultViewports, ...customViewports]);

  viewports.forEach((viewport) => {
    describe(`${viewport}`, () => {
      beforeAll(async () => {
        await page.setViewport({ width: viewport, height: 1000 });
      });

      testToRun();
    });
  });
};

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  failureThreshold: '0.001',
});

expect.extend({ toMatchImageSnapshot });
