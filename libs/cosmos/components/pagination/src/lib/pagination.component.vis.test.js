xdescribe('Pagination Component', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let paginationElement;

  let elementSelector = '.cos-pagination';

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
        await loadPage('iframe.html?id=pagination--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        paginationElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
    });
  });

  viewports.forEach((viewport) => {
    xdescribe(`${viewport.width}x${viewport.height}`, () => {
      beforeEach(async () => {
        await loadPage('iframe.html?id=pagination--small');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        paginationElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
    });
  });
});
