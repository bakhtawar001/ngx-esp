describe('Segmented Panel', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let element;

  let elementSelector = '.cos-segmented-panel';

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
    describe(`${viewport.width}x${viewport.height}`, () => {
      beforeEach(async () => {
        await loadPage('iframe.html?id=segmented-panel--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        element = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
    });
  });
});
