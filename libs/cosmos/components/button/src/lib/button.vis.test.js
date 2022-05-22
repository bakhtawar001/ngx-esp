/**
 * basic:
 * size: default
 * disabled
 * icon left
 * icon right
 * color: default
 * color: primary
 * color: warn
 * size: small
 * size: large
 *
 */

/*


button--basic
&knob-Text=Button%20Text
&knob-Color=primary
&knob-Size=
&knob-Icon%20%28Left%29=
&knob-Icon%20%28Right%29=
&knob-Disabled=
&viewMode=


 */

describe('renders', () => {
  beforeEach(async () => {
    await global.loadStorybookPage('button--basic');
  });

  global.testMultipleViewports(() => {
    it('default', async () => {
      await global.screenshot();
    });

    it('hover', async () => {
      const target = await page.$('.cos-button');

      await target.hover();
      await global.screenshot();
    });

    it('focus', async () => {
      const target = await page.$('.cos-button');

      await target.focus();
      await global.screenshot();
    });
  }, []);
});
