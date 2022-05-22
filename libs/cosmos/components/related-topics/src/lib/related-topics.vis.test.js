xdescribe('Related Topics Component', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let relatedTopicsElement;

  let elementSelector = '.cos-related-topics-container';

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
        await loadPage('iframe.html?id=related-topics--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        relatedTopicsElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });

      test('should render correctly on hover', async () => {
        await relatedTopicsElement.hover();
        await matchBodyScreenshot();
      });
    });
  });
});
