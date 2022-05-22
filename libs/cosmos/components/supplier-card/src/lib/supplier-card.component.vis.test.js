xdescribe('Supplier Card Component', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let supplierCardElement;

  let elementSelector = '.cos-supplier-card';

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
        await loadPage('iframe.html?id=supplier-card--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        supplierCardElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
      test('should render correctly on hover', async () => {
        await supplierCardElement.hover();
        await matchBodyScreenshot();
      });
    });
  });
});
