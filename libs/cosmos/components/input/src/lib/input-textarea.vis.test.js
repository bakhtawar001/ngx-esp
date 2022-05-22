xdescribe('Text Area - Input Directive', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let inputElement;

  let elementSelector = '.cos-input';

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
        await loadPage('iframe.html?id=forms-textarea--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        inputElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });

      test('should render correctly on hover', async () => {
        await inputElement.hover();
        await matchBodyScreenshot();
      });
    });
  });
});
