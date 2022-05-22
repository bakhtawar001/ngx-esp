xdescribe('CosCollectionSectionComponent', () => {
  const { loadPage, matchPageScreenshot } = global.utils;

  let component;
  let elementSelector = '.cos-collection-section';

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
        await loadPage('iframe.html?id=collection-section--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        component = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchPageScreenshot();
      });
    });
  });
});
