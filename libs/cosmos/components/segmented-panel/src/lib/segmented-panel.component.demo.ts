import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cos-segmented-panel-demo-component',
  styles: [
    '.cos-segment-panel-controls-example {display: flex; align-items:center; justify-content: space-between }',
  ],
  template: `
    <cos-segmented-panel>
      <cos-segmented-panel-header>
        <div class="cos-segment-panel-controls-example">
          <h2 class="header-style-16 mb-2 mt-2">Header</h2>

          <button *ngIf="showButton" cos-flat-button color="primary" size="sm">
            <i class="fas fa-plus"></i> Add section
          </button>
        </div>
      </cos-segmented-panel-header>
      <cos-segmented-panel-row> Row 1</cos-segmented-panel-row>
      <cos-segmented-panel-row> Row 2</cos-segmented-panel-row>
      <cos-segmented-panel-row> Row 3</cos-segmented-panel-row>
    </cos-segmented-panel>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosSegmentedPanelDemoComponent {
  @Input() showButton = false;
}
