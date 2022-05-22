xdescribe('Explore Bar Component', () => {
  const { loadPage, matchPageScreenshot } = global.utils;

  let featuresElement;

  let elementSelector = '.cos-explore-bar';
  let btnSelector = '.cos-btn--icon-right';

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
        await loadPage('iframe.html?id=explore-bar--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        featuresElement = await page.$(elementSelector);
        await page.waitFor(btnSelector);
        btnElement = await page.$(btnSelector);
      });

      test('should render menu correctly', async () => {
        await matchPageScreenshot();
      });

      test('should render megamenu correctly', async () => {
        await btnElement.click();
        await matchPageScreenshot();
      });
    });
  });
});
