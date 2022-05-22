xdescribe('Badge Component', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let badgeElement;

  let elementSelector = '.cos-badge';

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
        await loadPage('iframe.html?id=badge--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        badgeElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });

      test('should render correctly on hover', async () => {
        await badgeElement.hover();
        await matchBodyScreenshot();
      });
    });
  });
});
