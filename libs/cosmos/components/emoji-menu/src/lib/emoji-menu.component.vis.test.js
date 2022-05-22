xdescribe('Accordion Component', () => {
  const { loadPage, matchPageScreenshot } = global.utils;

  let component;
  let elementSelector = '.emoji-mart-emoji';

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
        await loadPage('iframe.html?id=emoji-menu--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        component = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchPageScreenshot();
      });

      test('should render correctly on expand', async () => {
        await component.click();
        await matchPageScreenshot();
      });
    });
  });
});
