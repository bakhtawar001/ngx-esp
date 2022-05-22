import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosVideoPlayerComponent } from './video-player.component';
import { CosVideoPlayerModule } from './video-player.module';

describe('CosVideoPlayerComponent', () => {
  let component: CosVideoPlayerComponent;
  let spectator: Spectator<CosVideoPlayerComponent>;
  const createComponent = createComponentFactory({
    component: CosVideoPlayerComponent,
    imports: [CosVideoPlayerModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        video: {
          Id: 31182750,
          Type: 'VD',
          Url: 'https://www.youtube.com/watch?v=hCjwxIuH2VE',
          IsPrimary: false,
        },
      },
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
