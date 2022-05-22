xdescribe('Featured Videos Component', () => {
  const { loadPage, matchPageScreenshot } = global.utils;

  let featuresElement;

  let elementSelector = '.cos-features';

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
        await loadPage('iframe.html?id=features--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        featuresElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchPageScreenshot();
      });
    });
  });
});
