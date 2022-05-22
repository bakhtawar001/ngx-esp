xdescribe('Date Picker Component', () => {
  const { loadPage, matchPageScreenshot } = global.utils;

  let element;

  let elementSelector = '.cos-date-picker';

  let buttonElement;

  let buttonSelector = '.mat-icon-button';

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
        await loadPage('iframe.html?id=date-picker--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        element = await page.$(elementSelector);
        buttonElement = await page.$(buttonSelector);
      });

      test('should render correctly', async () => {
        await matchPageScreenshot();
      });

      test('should render correctly on click', async () => {
        await buttonElement.click();
        await matchPageScreenshot();
      });
    });
  });
});
