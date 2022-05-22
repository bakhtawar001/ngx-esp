xdescribe('Input (text) - Input Directive - Primary', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let inputElement;

  let elementSelector = '.cos-input';

  const viewports = [
    {
      width: 375,
      height: 667,
    },
    {
      width: 1024,
      height: 768,
    },
  ];

  viewports.forEach((viewport) => {
    xdescribe(`${viewport.width}x${viewport.height}`, () => {
      beforeEach(async () => {
        await loadPage('iframe.html?id=forms-input--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        inputElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });

      test('should render correctly on hover', async () => {
        await inputElement.hover();
        await matchBodyScreenshot();
      });
    });
  });
});

xdescribe('Input (text) - Input Directive - Small', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let inputElement;

  let elementSelector = '.cos-input';

  const viewports = [
    {
      width: 375,
      height: 667,
    },
    {
      width: 1024,
      height: 768,
    },
  ];

  viewports.forEach((viewport) => {
    xdescribe(`${viewport.width}x${viewport.height}`, () => {
      beforeEach(async () => {
        await loadPage('iframe.html?id=forms-input--small');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        inputElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });

      test('should render correctly on hover', async () => {
        await inputElement.hover();
        await matchBodyScreenshot();
      });
    });
  });
});

xdescribe('Input (text) - Input Directive - Large', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let inputElement;

  let elementSelector = '.cos-input';

  const viewports = [
    {
      width: 375,
      height: 667,
    },
    {
      width: 1024,
      height: 768,
    },
  ];

  viewports.forEach((viewport) => {
    xdescribe(`${viewport.width}x${viewport.height}`, () => {
      beforeEach(async () => {
        await loadPage('iframe.html?id=forms-input--large');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        inputElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });

      test('should render correctly on hover', async () => {
        await inputElement.hover();
        await matchBodyScreenshot();
      });
    });
  });
});

xdescribe('Input (text) - Input Directive - Disabled', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let inputElement;

  let elementSelector = '.cos-input';

  const viewports = [
    {
      width: 375,
      height: 667,
    },
    {
      width: 1024,
      height: 768,
    },
  ];

  viewports.forEach((viewport) => {
    xdescribe(`${viewport.width}x${viewport.height}`, () => {
      beforeEach(async () => {
        await loadPage('iframe.html?id=forms-input--disabled');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        inputElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });

      test('should render correctly on hover', async () => {
        await inputElement.hover();
        await matchBodyScreenshot();
      });
    });
  });
});
