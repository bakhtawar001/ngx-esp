xdescribe('Atrribute Tag Directive', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let tagElement;

  let elementSelector = '.cos-attribute-tag';

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
        await loadPage('iframe.html?id=attribute-tag--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        tagElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
    });
  });
});
