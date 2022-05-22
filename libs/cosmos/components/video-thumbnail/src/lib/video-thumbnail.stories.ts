import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import markdown from './video-thumbnail.md';
import { CosVideoThumbnailModule } from './video-thumbnail.module';

@Component({
  selector: 'cos-card-demo-component',
  template: ` <cos-video-thumbnail [video]="video"></cos-video-thumbnail> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosVideoThumbnailDemoComponent {
  video = {
    Id: 31182750,
    Type: 'VD',
    Url: 'https://www.youtube.com/watch?v=hCjwxIuH2VE',
    IsPrimary: false,
  };
}

export default {
  title: 'Media/Video Thumbnail',

  parameters: {
    notes: markdown,
  },
};

export const primary = () => ({
  moduleMetadata: {
    declarations: [CosVideoThumbnailDemoComponent],
    imports: [BrowserAnimationsModule, CosVideoThumbnailModule],
  },
  component: CosVideoThumbnailDemoComponent,
});
