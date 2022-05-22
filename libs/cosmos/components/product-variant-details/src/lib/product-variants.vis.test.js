xdescribe('Product Variant Component With Images', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let productVariants;

  let elementSelector = '.cos-product-variants';

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
        await loadPage('iframe.html?id=product-variants--with-images');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        productVariants = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
    });
  });
});

xdescribe('Product Variant Component Without Images', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let productVariants;

  let elementSelector = '.cos-product-variants';

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
        await loadPage('iframe.html?id=product-variants--list-only');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        productVariants = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
    });
  });
});
