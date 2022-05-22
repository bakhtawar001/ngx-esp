xdescribe('Product Grid Component', () => {
  const { loadPage, matchPageScreenshot } = global.utils;

  let productCardElement;

  let elementSelector = '.cos-product-grid';

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
        await loadPage('iframe.html?id=product-grid--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        productCardElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchPageScreenshot();
      });
    });
  });
});
