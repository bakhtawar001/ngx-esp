xdescribe('Product Card Component', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let productCardElement;

  let elementSelector = '.cos-product-card';

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
        await loadPage('iframe.html?id=product-card--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        productCardElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
      test('should render correctly on hover', async () => {
        await productCardElement.hover();
        await matchBodyScreenshot();
      });
      test('should render client-facing view', async () => {
        await loadPage('iframe.html?id=product-card--client-facing');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        productCardElement = await page.$(elementSelector);
        await matchBodyScreenshot();
      });
    });
  });
});
