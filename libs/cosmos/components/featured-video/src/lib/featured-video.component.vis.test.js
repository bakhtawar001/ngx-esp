xdescribe('Featured Videos Component', () => {
  const { loadPage, matchPageScreenshot } = global.utils;

  let featuredVideoElement;

  let elementSelector = '.cos-featured-video';

  const viewports = [
    {
      width: 375,
      height: 667,
    },
  ];

  viewports.forEach((viewport) => {
    xdescribe(`${viewport.width}x${viewport.height}`, () => {
      beforeEach(async () => {
        await loadPage('iframe.html?id=featured-video--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        featuredVideoElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchPageScreenshot();
      });
    });
  });
});
