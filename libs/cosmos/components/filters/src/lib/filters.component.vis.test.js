xdescribe('Filters Component', () => {
  const { loadPage, matchPageScreenshot } = global.utils;

  let element;
  let btnElement;

  let elementSelector = '.cos-filters';

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

  xdescribe('mobile', () => {
    beforeEach(async () => {
      await loadPage('iframe.html?id=filters--primary');
      await page.setViewport(viewports[0]);
      await page.waitFor(elementSelector);
      element = await page.$(elementSelector);
    });

    test('should render filter bar correctly', async () => {
      await matchPageScreenshot();
    });

    test('should render menu correctly', async () => {
      await page.waitFor('.cos-filter-btn');
      btnElement = await page.$('.cos-filter-btn');
      await btnElement.click();
      await matchPageScreenshot();
    });
  });

  xdescribe('desktop', () => {
    beforeEach(async () => {
      await loadPage('iframe.html?id=filters--primary');
      await page.setViewport(viewports[1]);
      await page.waitFor(elementSelector);
      element = await page.$(elementSelector);
    });

    test('should render buttons correctly', async () => {
      await matchPageScreenshot();
    });

    test('should render menu correctly', async () => {
      await page.waitFor('.cos-filter-btn');
      btnElement = await page.$('.cos-filter-btn');
      await btnElement.click();
      await matchPageScreenshot();
    });
  });
});
