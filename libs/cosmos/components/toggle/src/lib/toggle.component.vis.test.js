xdescribe('Toggle Component', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let toggleElement;

  let elementSelector = '.cos-slide-toggle';

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
        await loadPage('iframe.html?id=toggle--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        toggleElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });

      test('should render correctly on hover', async () => {
        await toggleElement.hover();
        await matchBodyScreenshot();
      });
    });
  });
});
