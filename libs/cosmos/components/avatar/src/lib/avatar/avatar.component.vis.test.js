xdescribe('Avatar Component -- Text', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let avatarElement;

  let elementSelector = '.cos-avatar';

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
        await loadPage('iframe.html?id=avatar--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        avatarElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
    });
  });
});

xdescribe('Avatar Component -- Image', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let avatarElement;

  let elementSelector = '.cos-avatar';

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
        await loadPage('iframe.html?id=avatar--with-image');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        avatarElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
    });
  });
});
