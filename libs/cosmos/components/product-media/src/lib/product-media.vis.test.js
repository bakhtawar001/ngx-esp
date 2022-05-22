xdescribe('Product Media Component', () => {
  const { loadPage, matchPageScreenshot } = global.utils;

  let productMediaElement;

  let elementSelector = '.cos-product-media';

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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
        await loadPage('iframe.html?id=product-media--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        productMediaElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchPageScreenshot();
      });
    });
  });
});

xdescribe('Product Media Component - Edit Mode', () => {
  const { loadPage, matchPageScreenshot } = global.utils;

  let productMediaElement;

  let elementSelector = '.cos-product-media';

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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
        await loadPage('iframe.html?id=product-media--edit-mode');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        productMediaElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchPageScreenshot();
      });
    });
  });
});
