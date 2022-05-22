xdescribe('Dropdown Filter Component', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let dropdownFilterElement;

  let elementSelector = '.cos-dropdown-filter';

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
    describe(`${viewport.width}x${viewport.height}`, () => {
      beforeEach(async () => {
        await loadPage('iframe.html?id=dropdown-filter--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        dropdownFilterElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
    });
  });
});
