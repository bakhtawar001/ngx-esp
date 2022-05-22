xdescribe('Contact Info Component', () => {
  const { loadPage, matchBodyScreenshot, matchPageScreenshot } = global.utils;

  let supplierElement;

  let elementSelector = '.cos-contact-info';

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
        await loadPage('iframe.html?id=contact-information--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        supplierElement = await page.$(elementSelector);
      });

      test('primary should render correctly', async () => {
        await matchPageScreenshot();
      });
    });
    xdescribe(`${viewport.width}x${viewport.height}`, () => {
      beforeEach(async () => {
        await loadPage('iframe.html?id=contact-information--company-contacts');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        supplierElement = await page.$(elementSelector);
      });

      test('contacts should render correctly', async () => {
        await matchPageScreenshot();
      });
    });
    xdescribe(`${viewport.width}x${viewport.height}`, () => {
      beforeEach(async () => {
        await loadPage(
          'iframe.html?id=contact-information--distributor-references'
        );
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        supplierElement = await page.$(elementSelector);
      });

      test('references should render correctly', async () => {
        await matchPageScreenshot();
      });
    });
  });
});
