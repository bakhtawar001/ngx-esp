xdescribe('Global Header Component', () => {
  const { loadPage, matchPageScreenshot } = global.utils;

  let element;
  let btnElement;

  let elementSelector = '.cos-global-header';

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
      await loadPage('iframe.html?id=global-header--primary');
      await page.setViewport(viewports[0]);
      await page.waitFor(elementSelector);
      element = await page.$(elementSelector);
    });

    test('should render menu correctly', async () => {
      await matchPageScreenshot();
    });

    test('should render dropdown correctly', async () => {
      await page.waitFor('.cos-global-nav-mobile button.cos-btn');
      btnElement = await page.$('.cos-global-nav-mobile button.cos-btn');
      await btnElement.click();
      await matchPageScreenshot();
    });
  });

  xdescribe('desktop', () => {
    beforeEach(async () => {
      await loadPage('iframe.html?id=global-header--primary');
      await page.setViewport(viewports[1]);
      await page.waitFor(elementSelector);
      element = await page.$(elementSelector);
    });

    test('should render menu correctly', async () => {
      await matchPageScreenshot();
    });

    test('should render dropdown correctly', async () => {
      await page.waitFor('.cos-global-nav-desktop button.cos-btn');
      btnElement = await page.$('.cos-global-nav-desktop button.cos-btn');
      await btnElement.click();
      await matchPageScreenshot();
    });
  });
});
