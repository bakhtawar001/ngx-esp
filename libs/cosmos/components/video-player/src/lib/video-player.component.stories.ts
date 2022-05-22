import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import markdown from './video-player.md';
import { CosVideoPlayerModule } from './video-player.module';

@Component({
  selector: 'cos-related-topics-demo-component',
  template: `<div style="width: 640px; height: 480px;">
    <cos-video-player [video]="video"></cos-video-player>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosVideoPlayerDemoComponent {
  video = {
    Id: 31182750,
    Type: 'VD',
    Url: 'https://www.youtube.com/watch?v=hCjwxIuH2VE',
    IsPrimary: false,
  };
}

export default {
  title: 'Media/Video Player',
  parameters: {
    notes: markdown,
  },
};

export const primary = () => ({
  moduleMetadata: {
    declarations: [CosVideoPlayerDemoComponent],
    imports: [BrowserAnimationsModule, CosVideoPlayerModule],
  },
  component: CosVideoPlayerDemoComponent,
  props: {},
});
