xdescribe('Input Row Component', () => {
  const { loadPage, matchPageScreenshot } = global.utils;

  let element;
  let btnElement;

  let elementSelector = '.cos-input-row';
  let btnSelector = '[aria-label="Toggle hidden"]';

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
        await loadPage('iframe.html?id=forms-input-row--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        element = await page.$(elementSelector);
        await page.waitFor(btnSelector);
        btnElement = await page.$(btnSelector);
      });

      test('should render correctly', async () => {
        await matchPageScreenshot();
      });
      test('should render correctly when disabled', async () => {
        await btnElement.click();
        await matchPageScreenshot();
      });
    });
  });
});
