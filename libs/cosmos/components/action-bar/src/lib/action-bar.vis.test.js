xdescribe('Action Bar Component', () => {
  const { loadPage, matchPageScreenshot } = global.utils;

  let element;

  let elementSelector = '.cos-action-bar';

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
        await loadPage('iframe.html?id=action-bar--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        element = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchPageScreenshot();
      });
    });
  });
});
