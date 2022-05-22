xdescribe('Rating Component', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let element;

  let elementSelector = '.cos-rating';

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
        await loadPage('iframe.html?id=rating--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        element = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
    });
  });

  viewports.forEach((viewport) => {
    xdescribe(`${viewport.width}x${viewport.height}`, () => {
      beforeEach(async () => {
        await loadPage('iframe.html?id=rating--unrated');
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
