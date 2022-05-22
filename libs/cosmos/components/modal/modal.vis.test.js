xdescribe('Modal', () => {
  const { loadPage, matchPageScreenshot } = global.utils;

  let btnElement;

  let btnSelector = '.cos-btn';

  const viewports = [
    {
      width: 375,
      height: 667,
    },
    {
      width: 1024,
      height: 768,
    },
    {
      width: 1920,
      height: 1080,
    },
  ];

  viewports.forEach((viewport) => {
    xdescribe(`${viewport.width}x${viewport.height}`, () => {
      beforeEach(async () => {
        await loadPage('iframe.html?id=modal--primary');
        await page.setViewport(viewport);
        await page.waitFor(btnSelector);
        btnElement = await page.$(btnSelector);
        await btnElement.click();
      });

      test('should render correctly on click', async () => {
        await matchPageScreenshot();
      });
    });
  });
});
