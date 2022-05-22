import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'cos-segmented-panel-row',
  templateUrl: 'segmented-panel-row.component.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cos-segmented-panel-row',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosSegmentedPanelRowComponent {}
