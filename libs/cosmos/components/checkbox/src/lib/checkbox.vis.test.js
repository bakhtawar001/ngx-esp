xdescribe('Checkbox Component', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let checkboxElement;

  let elementSelector = '.cos-checkbox-layout';

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
        await loadPage('iframe.html?id=forms-checkbox--primary');
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        checkboxElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });

      test('should render correctly on hover', async () => {
        await checkboxElement.hover();
        await matchBodyScreenshot();
      });
    });
  });
});

xdescribe('Checkbox Component - Disabled', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let checkboxElement;

  let elementSelector = '.cos-checkbox-layout';

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
          'iframe.html?id=forms-checkbox--primary&disabled=true&knob-Label%20Position=after&knob-Size=&knob-Disabled=true&knob-Type=primary&knob-Text=Button%20Text&knob-ID=checkbox-1&knob-Name=checkbox-1&knob-Label=This%20is%20a%20checkbox&knob-Value=checkbox-1&knob-Aria%20Labelled%20By=&knob-Checked=false'
        );
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        checkboxElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });

      test('should render correctly on hover', async () => {
        await checkboxElement.hover();
        await matchBodyScreenshot();
      });
    });
  });
});

xdescribe('Checkbox Component - Disabled Checked', () => {
  const { loadPage, matchBodyScreenshot } = global.utils;

  let checkboxElement;

  let elementSelector = '.cos-checkbox-layout';

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
          'iframe.html?id=forms-checkbox--primary&disabled=true&knob-Label%20Position=after&knob-Size=&knob-Disabled=true&knob-Type=primary&knob-Text=Button%20Text&knob-ID=checkbox-1&knob-Name=checkbox-1&knob-Label=This%20is%20a%20checkbox&knob-Value=checkbox-1&knob-Aria%20Labelled%20By=&knob-Checked=true'
        );
        await page.setViewport(viewport);
        await page.waitFor(elementSelector);
        checkboxElement = await page.$(elementSelector);
      });

      test('should render correctly', async () => {
        await matchBodyScreenshot();
      });

      test('should render correctly on hover', async () => {
        await checkboxElement.hover();
        await matchBodyScreenshot();
      });
    });
  });
});
