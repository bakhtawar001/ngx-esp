xdescribe('Form Field Component', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let formFieldElement;

  let elementSelector = '.cos-form-field';

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
        await loadPage('iframe.html?id=forms-form-field--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        formFieldElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
    });
  });
});
