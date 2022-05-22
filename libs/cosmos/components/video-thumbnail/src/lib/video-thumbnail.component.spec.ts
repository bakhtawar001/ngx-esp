import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosVideoThumbnailComponent } from './video-thumbnail.component';
import { CosVideoThumbnailModule } from './video-thumbnail.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('CosVideoThumbnailComponent', () => {
  let component: CosVideoThumbnailComponent;
  let spectator: Spectator<CosVideoThumbnailComponent>;
  const createComponent = createComponentFactory({
    component: CosVideoThumbnailComponent,
    imports: [CosVideoThumbnailModule, HttpClientTestingModule],
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
