xdescribe('Customer Dropdown Component', () => {
  const { loadPage, matchPageScreenshot } = global.utils;

  let element;
  let btnElement;

  let elementSelector = '.cos-customer-dropdown';

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
      await loadPage('iframe.html?id=customer-dropdown--primary');
      await page.setViewport(viewports[0]);
      await page.waitFor(elementSelector);
      element = await page.$(elementSelector);
    });

    test('should render closed correctly', async () => {
      await matchPageScreenshot();
    });

    test('should render open correctly', async () => {
      await page.waitFor('select.cos-input');
      btnElement = await page.$('select.cos-input');
      await btnElement.click();
      await matchPageScreenshot();
    });
  });

  xdescribe('desktop', () => {
    beforeEach(async () => {
      await loadPage('iframe.html?id=customer-dropdown--primary');
      await page.setViewport(viewports[1]);
      await page.waitFor(elementSelector);
      element = await page.$(elementSelector);
    });

    test('should render closed correctly', async () => {
      await matchPageScreenshot();
    });

    test('should render open correctly', async () => {
      await page.waitFor('.mat-select');
      btnElement = await page.$('.mat-select');
      await btnElement.click();
      await matchPageScreenshot();
    });
  });
});
