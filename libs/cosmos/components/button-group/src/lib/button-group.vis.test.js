xdescribe('Button Group Component', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let buttonGroupElement;

  let elementSelector = '.cos-button-group';
  let elementButtonSelector = '.cos-button-group-toggle';

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
        await loadPage('iframe.html?id=button-group--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        buttonGroupElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });

      test('should render correctly on hover', async () => {
        await buttonGroupElement.hover();
        await matchBodyScreenshot();
      });

      test('should render correctly on focus', async () => {
        await elementButtonSelector.focus();
        await matchBodyScreenshot();
      });
    });
  });
});
