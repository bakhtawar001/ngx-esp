describe('renders', () => {
  beforeEach(async () => {
    await global.loadStorybookPage('accordion--primary');
  });

  global.testMultipleViewports(() => {
    it('expanded', async () => {
      await global.screenshot();
    });

    it('collapsed', async () => {
      const target = await page.$('.cos-accordion-btn');

      await target.click();
      await global.screenshot();
    });
  }, []);
});
