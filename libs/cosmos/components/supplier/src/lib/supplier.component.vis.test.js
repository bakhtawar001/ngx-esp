xdescribe('Supplier Component', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let supplierElement;

  let elementSelector = '.cos-supplier';

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
        await loadPage('iframe.html?id=supplier--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        supplierElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
    });
  });

  viewports.forEach((viewport) => {
    xdescribe(`${viewport.width}x${viewport.height}`, () => {
      beforeEach(async () => {
        await loadPage('iframe.html?id=supplier--no-rating');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        supplierElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
    });
  });
});
