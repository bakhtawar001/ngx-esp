xdescribe('Cart List Component', () => {
  const { loadPage, matchPageScreenshot } = global.utils;

  let component = '';
  let elementSelector = '.cos-cart-list';

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
        await loadPage('iframe.html?id=cart-list--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        component = await page.$(elementSelector);
      });

      test('primary should render correctly', async () => {
        await matchPageScreenshot();
      });
    });
  });
});
