import {
  Component,
  Input,
  ViewEncapsulation,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { VideoService } from '@cosmos/core';

@Component({
  selector: 'cos-video-thumbnail',
  templateUrl: './video-thumbnail.component.html',
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosVideoThumbnailComponent implements OnInit {
  @Input() video: Record<string, any> | null = null;
  @Input() alt = '';
  @Input() settings: { size: string } | null = null;

  videoObj: any = null;

  constructor(private _videoService: VideoService) {}

  ngOnInit(): void {
    if (this.video) {
      this.videoObj = this._videoService.getVideoObj(this.video.Url);
    }
  }
}
