xdescribe('Pill Component', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let pillElement;

  let elementSelector = '.cos-pill';

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
        await loadPage('iframe.html?id=pill--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        pillElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
    });
  });
});
