import {
  Component,
  EventEmitter,
  Input,
  ViewEncapsulation,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'cos-featured-video',
  templateUrl: './featured-video.component.html',
  styleUrls: ['./featured-video.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cos-featured-video',
  },
})
export class CosFeaturedVideoComponent {
  @Input() heading!: string;
  @Input() description: string | null = null;
  @Input() video: any; // TODO: I don't know the type here...

  @Output() readonly videoPlayRequested = new EventEmitter<any>();
}
