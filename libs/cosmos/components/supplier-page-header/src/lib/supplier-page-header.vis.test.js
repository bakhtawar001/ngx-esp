xdescribe('Supplier Page Header Component', () => {
  const { loadPage, matchBodyScreenshot, matchPageScreenshot } = global.utils;

  let supplierElement;
  let btnElement;

  let elementSelector = '.cos-supplier-page-header';
  let btnSelector = '[data-test="expand"]';

  const viewports = [
    {
      width: 375,
      height: 3600,
    },
    {
      width: 1280,
      height: 1920,
    },
  ];

  viewports.forEach((viewport) => {
    xdescribe(`${viewport.width}x${viewport.height}`, () => {
      beforeEach(async () => {
        await loadPage('iframe.html?id=supplier-page-header--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        supplierElement = await page.$(elementSelector);
        await page.waitFor(btnSelector);
        btnElement = await page.$(btnSelector);
      });

      test('should render correctly', async () => {
        await matchPageScreenshot();
      });
      test('should render correctly expanded', async () => {
        await btnElement.click();
        await matchPageScreenshot();
      });
    });
  });
});
