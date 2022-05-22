import markdown from './featured-video.md';
import { CosFeaturedVideoModule } from './featured-video.module';

export default {
  title: 'Objects/Featured Media',

  parameters: {
    notes: markdown,
  },
};

export const primary = () => ({
  moduleMetadata: {
    imports: [CosFeaturedVideoModule],
    declarations: [],
  },
  template: `
  <div style="max-width: 320px;">
    <cos-featured-video
      [video]="{
        Id: 31182750,
        Url: 'https://www.youtube.com/watch?v=hCjwxIuH2VE'
      }"
      heading="Our Story"
      description="Lorem ipsum dolor sit amet, consectetur etra adipiscing elit, sed do eiusmod tempor veniam incididunt ut labore et dolore magna aliqua."
    >
    </cos-featured-video>
  </div>
  `,
});
