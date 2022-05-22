describe('Article Component', () => {
    const { loadPage, matchBodyScreenshot } = global.utils;

    let articleElement;

    let elementSelector = '.article-wrapper';

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
                await loadPage('iframe.html?id=articlecomponent--primary');
                await page.setViewport(viewport);
                await page.waitFor(elementSelector);
                articleElement = await page.$(elementSelector);
            });

            test('should render correctly', async () => {
                await matchBodyScreenshot();
            });

            test('should render correctly on hover', async () => {
                await articleElement.hover();
                await matchBodyScreenshot();
            });

        });

    });

});
