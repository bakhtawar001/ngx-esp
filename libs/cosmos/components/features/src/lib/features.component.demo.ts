import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cos-features-list-demo-component',
  template: `<cos-features heading="Videos">
    <cos-featured-video
      [video]="{
        Id: 31182750,
        Url: 'https://www.youtube.com/watch?v=hCjwxIuH2VE'
      }"
      heading="Our Story"
      description="Lorem ipsum dolor sit amet, consectetur etra adipiscing elit, sed do eiusmod tempor veniam incididunt ut labore et dolore magna aliqua."
    >
    </cos-featured-video>
    <cos-featured-video
      [video]="{
        Id: 31182750,
        Url: 'https://www.youtube.com/watch?v=hCjwxIuH2VE'
      }"
      heading="Product: Tote Bags"
      description="Duis aute irure dolor in reprehenderit in volus velit esse cillum dolore eu fugiat nulla."
    >
    </cos-featured-video>
    <cos-featured-video
      [video]="{
        Id: 31182750,
        Url: 'https://www.youtube.com/watch?v=hCjwxIuH2VE'
      }"
      heading="Product: Badges and Laywards"
      description="Tempor veniam incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur etra adipiscing elit."
    >
    </cos-featured-video>
    <cos-featured-video
      [video]="{
        Id: 31182750,
        Url: 'https://www.youtube.com/watch?v=hCjwxIuH2VE'
      }"
      heading="Product: Custom USBs"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
    >
    </cos-featured-video>
  </cos-features>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosFeaturesListDemoComponent {}
