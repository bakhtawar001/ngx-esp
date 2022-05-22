xdescribe('Video Thumbnail Component', () => {
  const { loadPage, matchPageScreenshot } = global.utils;

  let thumbnailElement;

  let elementSelector = '.cos-video-thumbnail';

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
        await loadPage('iframe.html?id=video-thumbnail--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        thumbnailElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchPageScreenshot();
      });
    });
  });
});
