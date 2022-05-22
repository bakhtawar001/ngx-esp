import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'cos-segmented-panel-header',
  templateUrl: 'segmented-panel-header.component.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cos-segmented-panel-header',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosSegmentedPanelHeaderComponent {}
