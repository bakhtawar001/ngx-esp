import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosFeaturedVideoComponent } from './featured-video.component';
import { CosFeaturedVideoModule } from './featured-video.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CosFeaturedVideos', () => {
  let component: CosFeaturedVideoComponent;
  let spectator: Spectator<CosFeaturedVideoComponent>;
  const createComponent = createComponentFactory({
    component: CosFeaturedVideoComponent,
    imports: [CosFeaturedVideoModule, HttpClientTestingModule],
    declarations: [CosFeaturedVideoComponent],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        video: {
          Id: 31182750,
          Url: 'https://www.youtube.com/watch?v=hCjwxIuH2VE',
        },
        heading: 'Videos',
        description:
          'Lorem ipsum dolor sit amet, consectetur etra adipiscing elit, sed do eiusmod tempor veniam incididunt ut labore et dolore magna aliqua.',
      },
    });
    component = spectator.component;
  });

  it('should exist', () => {
    expect(spectator).toExist();
  });
});
