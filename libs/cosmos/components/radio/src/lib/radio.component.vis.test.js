xdescribe('Radio Component', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let radioElement;

  let elementSelector = '.cos-radio-group';

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
        await loadPage('iframe.html?id=forms-radio--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        radioElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
    });
  });
});

xdescribe('Radio Component Disabled', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let radioElement;

  let elementSelector = '.cos-radio-group';

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
        await loadPage(
          'iframe.html?id=forms-radio--primary&disabled=true&knob-Label%20Position=after&knob-Size=&knob-Disabled=true'
        );
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        radioElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });
    });
  });
});
