xdescribe('Tabs Component', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let badgeElement;

  let elementSelector = '.mat-tab-group';

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
        await loadPage('iframe.html?id=tabs--single-route');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        badgeElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
    });
  });
});
