import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'cos-segmented-panel',
  templateUrl: 'segmented-panel.component.html',
  styleUrls: ['segmented-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cos-segmented-panel',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosSegmentedPanelComponent {}
