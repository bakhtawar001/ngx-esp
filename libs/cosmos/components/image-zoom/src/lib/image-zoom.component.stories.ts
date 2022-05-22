import { actions } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/angular';
import { arg } from '@cosmos/storybook';
import { CosImageZoomComponent, ZoomMode } from './image-zoom.component';
import { CosImageZoomModule } from './image-zoom.module';

const actionsData = actions('ZoomPositionChange', 'ZoomScrollChange');

export default {
  title: 'Media/CosImageZoomComponent',
  component: CosImageZoomComponent,
  args: {
    zoomMode: ZoomMode.HOVER,
    thumbImage:
      'https://media2.s-nbcnews.com/i/newscms/2019_17/1429855/banana-main-fruit-peel_a7a8c6ce60a36207efcc44ab86788d4f.jpg',
    fullImage:
      'https://media2.s-nbcnews.com/i/newscms/2019_17/1429855/banana-main-fruit-peel_a7a8c6ce60a36207efcc44ab86788d4f.jpg',
  },
  argTypes: {
    thumbImage: arg('Thumbnail'),
    fullImage: arg('Full-sized image'),
  },
} as Meta;

const Template: Story<CosImageZoomComponent> = (args) => ({
  component: CosImageZoomComponent,
  moduleMetadata: {
    imports: [CosImageZoomModule],
  },
  props: {
    ...args,
    ...actionsData,
  },
});

export const primary = Template.bind({});
