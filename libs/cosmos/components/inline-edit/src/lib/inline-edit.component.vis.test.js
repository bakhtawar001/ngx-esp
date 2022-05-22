xdescribe('Card Component', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let element;
  let btnElement;

  let elementSelector = '.cos-inline-edit';
  let btnSelector = '.cos-edit';

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
    xdescribe(`Text Input ${viewport.width}x${viewport.height}`, () => {
      beforeEach(async () => {
        await loadPage('iframe.html?id=inline-edit--text-input');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        element = await page.$(elementSelector);
        btnElement = await page.$(btnSelector);
        await btnElement.click();
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
    });
    xdescribe(`Textarea ${viewport.width}x${viewport.height}`, () => {
      beforeEach(async () => {
        await loadPage('iframe.html?id=inline-edit--textarea');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        element = await page.$(elementSelector);
        btnElement = await page.$(btnSelector);
        await btnElement.click();
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
    });
  });
});
