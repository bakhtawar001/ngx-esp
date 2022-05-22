xdescribe('Video Player', () => {
  const { loadPage, matchPageScreenshot } = global.utils;

  let videoPlayerElement;

  let elementSelector = '.cos-iframe-video-wrapper';

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
        await loadPage('iframe.html?id=video-player--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        videoPlayerElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchPageScreenshot();
      });
    });
  });
});
