import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { CosFeaturedVideoModule } from '@cosmos/components/featured-video';
import { CosFeaturesComponent } from './features.component';
import { CosFeaturesModule } from './features.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const template = `
    <cos-features>
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
    </cos-features>
  `;

describe('CosFeatures', () => {
  let component: CosFeaturesComponent;
  let spectator: SpectatorHost<CosFeaturesComponent>;
  const createHost = createHostFactory({
    component: CosFeaturesComponent,
    imports: [
      CosFeaturesModule,
      CosFeaturedVideoModule,
      HttpClientTestingModule,
    ],
  });

  beforeEach(() => {
    spectator = createHost(template);
    component = spectator.component;
  });

  it('should exist', () => {
    expect(spectator.queryHost('.cos-features')).toBeTruthy();
  });
});
